
import { Component } from '@angular/core';

import { Chart } from 'chart.js';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-chartjs';
  
  chart: Chart;
  name = 'Angular 5 chartjs';

  getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  getInvertColor(nColor:String) {
    var invertColor = "#";
     for (var i = 1;i < 7;i ++){
       invertColor += (0xF - parseInt(nColor[i], 16)).toString(16);
     } 
    return invertColor;
  }
  ngOnInit() {
    var nLength = 10; // Data Length
    var densityData = {
      label:"Density of Planets (kg/m3)",
      data:[],
      backgroundColor : [],
    };

    this.getInvertColor("#FF1100");
    var xlabels = [];
    for (var i = 0;i < nLength;i++){
      densityData.data.push((Math.random() * 10000).toFixed(6));  //Generate random value

      densityData.backgroundColor.push(this.getRandomColor()); //generate random color

      xlabels.push("Label " + (i+1));
    }
    let pointThis = this;
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: xlabels,
        datasets: [densityData],
      },
      options: {
        title: {
          display: true
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        },
        scales: {
        xAxes: [{
          gridLines: {
                color: "rgba(0, 0, 0, 0)",
            },
            barPercentage: 0.6,
             ticks: {
                autoSkip: false,
                maxRotation: 90,
                minRotation: 90,
                fontSize: 10,
                fontColor:"Black",
                defaultFontFamily: "Arial, Helvetica, sans-serif"
            }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
            fontSize: 12,
            fontColor: "Black",
            defaultFontFamily: "Arial, Helvetica, sans-serif",
          }
        }]
      }
    },
      plugins: {
            afterDatasetsDraw: function (context, easing) {
              var ctx = context.chart.ctx;
              var determineAxis = false; //false is vertical
              var sumofTextlength = 0;
              for (var i = 0; i < densityData.data.length; i++) {
                 sumofTextlength += ctx.measureText(densityData.data[i]).width;
              }
              context.data.datasets.forEach(function (dataset) {
                for (var i = 0; i < dataset.data.length; i++) {
                  if (dataset.data[i] != 0) {
                    var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
                    var textY = model.y;
                    ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, 'normal', Chart.defaults.global.defaultFontFamily);
                    ctx.textAlign = 'start';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = dataset.type == "line" ? "black" : "black";
                    ctx.save();
                    ctx.translate(model.x, textY);

                    var yOffset = model.y;
                    var textHeight = ctx.measureText(dataset.data[i]).width;
                    var chartAreaWidth = context.chartArea.right - context.chartArea.left;
                    ctx.fillStyle = pointThis.getInvertColor(dataset.backgroundColor[i]);
                    
                    if (sumofTextlength > chartAreaWidth){
                      ctx.rotate(Math.PI * 1.5);
                      if (yOffset < textHeight)
                      {
                          ctx.fillText(dataset.data[i], -textHeight, 0);
                      }
                      else                        
                        ctx.fillText(dataset.data[i], 0, 0);
                    }
                    else{
                      ctx.rotate(0);
                      console.log(((model.width - textHeight) / 2));
                      ctx.fillText(dataset.data[i], -textHeight / 2, -10);
                    }
                    ctx.restore();
                  }
                }
              });
            }
        }
    });
  }
}
