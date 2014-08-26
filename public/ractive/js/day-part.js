requirejs.config({
    'baseUrl': 'js/',
    'paths': {
      'jquery': './lib/jquery-2.0.3.min',
      'bootstrap': './lib/bootstrap.min',
      'd3': 'lib/d3.min',
      'dayPartLib': 'dayPartLib'
    },      
    'shim': {
        'jquery': {
          exports: 'jquery'
        },   
        'bootstrap': {
          deps: ['jquery'],
          exports: 'bootstrap'
        },
        'd3': {
          deps: ['jquery'],
          exports: 'd3'
        }
    }
});
require([
  'jquery',
  'dayPartLib',
  'd3',
  'bootstrap'
], function($, dayPart, d3) {
  'use strict';
  console.log($, dayPart, d3)
  
  var chart,
      selectOnChange = function(event) {
          d3.json('./json/' + $(this).find("option:selected").text(),
                   function(error, json) {
                      if (!error) {
                        chart.updateChart(json);
                      }
                    });
      };

  $('#select_json').change(selectOnChange);
  d3.json('./json/pages.json', function(error, json) {
    if (!error) {
      
      //console.log(data);
      chart = dayPart.createChart(json,
                                  {
                                    title: 'Top Categories by Day Part',
                                    ractiveTemplateId: '#dayPartTemplate'
                                    //width:
                                    //height:
                                  },
                                  'day-chart');    
      //setTimeout(function(){chart.updateChart(json);}, 5000)   //TEST updateChart

    } else {
      throw error;
    }
  });
});