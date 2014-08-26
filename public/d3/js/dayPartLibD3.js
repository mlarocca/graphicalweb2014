requirejs.config({
    'paths': {
      'jquery': './lib/jquery-2.0.3.min',      
      'd3': 'lib/d3.min',
      'bootstrap': './lib/bootstrap.min'
    },
    'shim': {
      'jquery': {
        exports: 'jquery'
      },  
        'd3': {
            exports: 'd3'
      },
      'bootstrap': {
            deps: ['jquery'],
            exports: 'bootstrap'
      }
    }
});

define(['jquery', 'd3', 'bootstrap'],
    
  
  /** @class CoOccurrenceMatrix
    * Factory class for the chart
    */
  function($, d3) { 
      'use strict';

      var DEFAULT_CHART_HEIGHT = 480,
          DEFAULT_CHART_WIDTH = 800,
          DEFAULT_BAR_MARGIN = 20,
          FORM_TEMPLATE = './templates/day_part_template.html';

      function scalePercent(p) {
          return p / 100;
      }


      function displayData (json, containerId, title, chartWidth, chartHeight, chartAreaHeight) {
          var n = json.length,
              fields = ['visitors', 'unique_visitors', 'clicks'],
              fieldsNbr = fields.length,
              tableField = 0,
              svgWidth = chartWidth / n,
              svgHeight = chartAreaHeight,
              sectionWidth = svgWidth,
              rectHeight = svgHeight - DEFAULT_BAR_MARGIN,
              rectWidth = sectionWidth * 0.75 / fieldsNbr - 5,
              rectMargin = (sectionWidth - rectWidth * fieldsNbr) / (1 + fieldsNbr),
              rectTopMargin = DEFAULT_BAR_MARGIN,

              container = d3.select('#' + containerId),
              segments = container.selectAll('div.day-part-section')
                       .data(json),
              newSegments,
              segmentChart,
              segmentLabels,
              segmentTable,
              segmentTableRows,
              updateSelection;

              segments.selectAll('div')
                       .remove();
              //segments.exit().remove();

              newSegments = segments
                       .enter()
                       .append('div')
                       .attr('class', 'day-part-section')
                       .style('width', sectionWidth + 'px')
                       .style('left', function (d, i) {
                                              return (i * sectionWidth) + 'px';
                                      })
                       .style('height', chartHeight + 'px');   


              segmentChart = segments
                          .append('div')
                          .attr('class', 'day-part-chart')
                            .append('svg:svg')
                            .attr('width', svgWidth)
                            .attr('height', svgHeight);

              fields.forEach(function (fieldName, fieldIndex) {
                  segmentChart
                    .append('text')
                    .attr('x', rectMargin + fieldIndex * (rectMargin + rectWidth) + rectWidth * 0.5)
                    .attr('y', function (d) {
                      return rectTopMargin - 1 + rectHeight * (1 - scalePercent(d[fieldName]));
                    })
                    .attr('text-anchor', 'middle')
                    .text(function (d) {
                      return d[fieldName];
                    });

                  segmentChart
                    .append('rect')
                    .attr('class', 'day-part-main-bar')
                    .attr('x', rectMargin + fieldIndex * (rectMargin + rectWidth))
                    .attr('y', function (d) {
                      return rectTopMargin + rectHeight * (1 - scalePercent(d[fieldName]));
                    })
                    .attr('width', rectWidth + 'px')
                    .transition()
                    .attr('height', function (d) {
                        return rectHeight * scalePercent(d[fieldName]);
                    })
                    .duration(1000);
              });

              segmentChart
                .append('line')
                .attr('x1', 0)
                .attr('x2', sectionWidth)
                .attr('y1', rectTopMargin + rectHeight)
                .attr('y2', rectTopMargin + rectHeight);
                       

              segmentLabels = segments
                                .append('div')
                                .attr('class', 'day-part-part-area');


              segmentLabels
                  .append('span')
                    .attr('class', 'day-part-name')
                    .text(function (d, i) {
                        return d.name;
                    })
                    .append('br');

              segmentLabels
                  .append('span')
                    .attr('class', 'day-part-time-window')
                    .text(function (d, i) {
                        return d.start_time + ' - ' + d.end_time;
                    });                    

              segmentTable = segments
                              .append('div')
                              .attr('class', 'day-part-table-container');
              
              segmentTableRows = segmentTable
                .append('table')
                .attr('class', 'day-part-table')
                  .selectAll('tr')
                  .data(function (d) {
                      return d.top_pages;
                  })
                  .enter()
                    .append('tr')
                    .attr('class', function (d) {
                      return d.selected ? 'day-part-table-selected' : '';
                    })
                    .on('click', function (d,i) {
                      updateSelection(d, this);
                      return false;
                    });

              segmentTableRows
                .append('td')
                .text(function (d, i){
                    return (i+1) + '.';
                });

              segmentTableRows
                .append('td')
                .attr('class', function (d) {
                  return d.highlighted ? 'day-part-table-highlighted' : '';
                })
                .text(function (d, i){
                    return d.page;
                });   

              segmentTableRows
                .append('td')
                .text(function (d, i){
                    return d[fields[tableField]] + '%';
                });                         


              updateSelection =  function (page, elem) {
                  if (page.selected) {
                    page.selected = false;
                    $(elem).toggleClass('day-part-table-selected');
                  } else {
                    page.selected = true;
                    $(elem).toggleClass('day-part-table-selected');

                  }
              };


      }

      /** @method drawChart
        * @for CoOccurrenceMatrix
        * @private
        *
        * Actually creates all the dom and svg elements to draw the chart.
        * 
        * @param {String} title   Title of the chart.
        * @param {String|Object} [parent]  Optional parameter, either the Id of the DOM element to which the 
        *                                   chart should be added, or the element itself. If it is omitted,
        *                                    the chart will be added to the document's body.
        * @return {Object}  Return the SVG element, as a D3 wrapper object.
        */
      function drawChart (json, title, chartWidth, chartHeight, chartAreaHeight, parent) {
        var container,
            ractive,
            containerId;

        //Retieve chart's parent and select its containing DOM element
        if (typeof parent === 'string'){
          container = $('#' + parent);
        }

        if (!container) {
          container = $('body');
        }

        displayData(json, container.attr('id'), title, chartWidth, chartHeight, chartAreaHeight);


        return {
                 updateChart: function updateChart(json) {
                      return displayData(json, container.attr('id'), title, chartWidth, chartHeight, chartAreaHeight);
                 }
        };
      }

      var module = {


        /** @method createChart
          * @for CoOccurrenceMatrix
          *
          * Create a Matrix chart to highlight relationships between items, drawn in a matrix form.
          * 
          * @param {Object} data   
          * @param {Object} options A list of optional parameters for the chart
          *                 <ul>
          *                     <li><b>title</b> Title of the chart.</li>
          *                 </ul>
          * @param {String|Object} [parent]  Optional parameter, either the Id of the DOM element to which the
          *                                    chart should be added, or the element itself. If it is omitted,
          *                                    the chart will be added to the document's body.
          * @param {Object} [loader]  A reference to the the loader bar for the chart, if present. Must hold a 'stop' method. 
          * @return {Object}  Return the SVG element, as a D3 wrapper object.
          */
        createChart: function createChart (data, options, parent, loader) {
          //If a page loader is set, stops and removes it
          if (loader && typeof loader.stop === 'function') {
            loader.stop();
          }

          return drawChart(data,
                    options.title || '',
                    options.width || DEFAULT_CHART_WIDTH,
                    options.height || DEFAULT_CHART_HEIGHT,
                    options.chartAreaHeight || DEFAULT_CHART_HEIGHT / 2,
                    parent);
        }
      };

      Object.seal(module);
      return module;

  });