requirejs.config({
    "paths": {
      "jquery": "./lib/jquery-2.0.3.min",      
      "ractive": "lib/ractive",
      "bootstrap": "./lib/bootstrap.min"
    },
    "shim": {
      "jquery": {
        exports: 'jquery'
      },  
        "ractive": {
            exports: 'Ractive'
      },
      "bootstrap": {
            deps: ['jquery'],
            exports: 'bootstrap'
      }
    }
});

define(["jquery", "ractive", "bootstrap"],
    
  
  /** @class CoOccurrenceMatrix
    * Factory class for the chart
    */
  function($, ractive) { 
      "use strict";

      var DEFAULT_CHART_HEIGHT = 480,
          DEFAULT_CHART_WIDTH = 800,
          DEFAULT_BAR_MARGIN = 20,
          DEFAULT_RACTIVE_TEMPLATE_ID = '#dayPartTemplate',
          FORM_TEMPLATE = "./templates/day_part_template.html";




      function displayData (json, ractiveTemplateId, container_id, title, chartWidth, chartHeight, chartAreaHeight) {
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
              ractive = new Ractive({
                el: container_id,
                template: ractiveTemplateId,
                data: {
                          daypart: json,
                          title: title,
                          fields: fields,
                          tableField: tableField,
                          rectWidth: rectWidth,
                          svgHeight: svgHeight,
                          svgWidth: svgWidth,
                          chartWidth: chartWidth,
                          chartHeight: chartHeight,
                          rectHeight: rectHeight,
                          sectionWidth: sectionWidth,
                          rectMargin: rectMargin,
                          rectTopMargin: DEFAULT_BAR_MARGIN,
                          scalePercent: function scalePercent(p) {
                              return p / 100;
                          }
                      }
              });


              ractive.on({
                    updateSelection:  function (event, part, page) {
                                        console.log(event.node, event.context, part, page)
                                        var data = ractive.get("daypart");
                                        page = data[part].top_pages[page];
                                        console.log(page)
                                        if (page.selected) {
                                          page.selected = false;
                                          data[part].selectedItemsTotal = data[part].selectedItemsTotal - page[fields[tableField]];
                                        } else {
                                          page.selected = true;
                                          data[part].selectedItemsTotal = data[part].selectedItemsTotal + page[fields[tableField]];
                                          //console.log(data[part].selectedItemsTotal)
                                        }
                                        ractive.animate('daypart', data, {easing: 'easeOut'});  //, duration: 3000
                                      }
                        });
          
          return ractive;
      }

      /** @method drawChart
        * @for CoOccurrenceMatrix
        * @private
        *
        * Actually creates all the dom and svg elements to draw the chart.
        * 
        * @param {String} title   Title of the chart.
        * @param {String} chartTemplate  The address of the template for the form panel.
        * @param {String|Object} [parent]  Optional parameter, either the Id of the DOM element to which the 
        *                                   chart should be added, or the element itself. If it is omitted,
        *                                    the chart will be added to the document's body.
        * @return {Object}  Return the SVG element, as a D3 wrapper object.
        */
      function drawChart (json, title, chartWidth, chartHeight, chartAreaHeight, chartTemplate, ractiveTemplateId, parent) {
        var container,
            ractive,
            container_id;

        //Retieve chart's parent and select its containing DOM element
        if (typeof parent === "string"){
          container = $("#" + parent);
        }

        if (!container) {
          container = $("body");
        }


        $.when($.get(chartTemplate))
          .then(function (html){
            container.html(html);
            container_id = "day_part_" + Math.random().toString(36).substr(2, 10);  //generate a random ID, to allow for multiple copies to run
            container.select(".day-part-container").attr("id", container_id);
            ractive = displayData(json, ractiveTemplateId, container_id, title, chartWidth, chartHeight, chartAreaHeight);
          });



        return {
            updateChart: function updateChart(newData) {
                var n = json.length,
                    svgWidth = ractive.get('chartWidth') / n,
                    sectionWidth = svgWidth;           
                ractive.animate('svgWidth', svgWidth);
                ractive.animate('sectionWidth', sectionWidth);
                ractive.animate('daypart', newData);
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
          *                     <li><b>chartTemplate</b> The address for the template to be used for the form panela above the chart. On default, FORM_TEMPLATE.</li>
          *                 </ul>
          * @param {String|Object} [parent]  Optional parameter, either the Id of the DOM element to which the
          *                                    chart should be added, or the element itself. If it is omitted,
          *                                    the chart will be added to the document's body.
          * @param {Object} [loader]  A reference to the the loader bar for the chart, if present. Must hold a "stop" method. 
          * @return {Object}  Return the SVG element, as a D3 wrapper object.
          */
        createChart: function createChart (data, options, parent, loader) {
          //If a page loader is set, stops and removes it
          if (loader && typeof loader.stop === "function") {
            loader.stop();
          }

          return drawChart(data,
                    options.title || "",
                    options.width || DEFAULT_CHART_WIDTH,
                    options.height || DEFAULT_CHART_HEIGHT,
                    options.chartAreaHeight || DEFAULT_CHART_HEIGHT / 2,
                    options.chartTemplate || FORM_TEMPLATE,
                    options.ractiveTemplateId || DEFAULT_RACTIVE_TEMPLATE_ID,
                    parent);
        }
      };

      Object.seal(module);
      return module;

  });