(function ($) {

    "use strict";

    function widgetLineChart( $scope ) {

        var id                  = $scope.data( 'id' ),
            $line_chart         = $scope.find( '.jet-line-chart-container' ),
            $line_chart_canvas  = $line_chart.find( '.jet-line-chart' ),
            $compare            = $line_chart.data( 'compare' ),
            previous_label      = $line_chart.data( 'previous-label' ),
            current_label       = $line_chart.data( 'current-label' ),
            settings            = $line_chart.data( 'settings' ),
            compare_labels_type = $line_chart.data( 'compare-labels-type' ),
            tooltip_prefix      = $line_chart.data( 'tooltip-prefix' ) || '',
            tooltip_suffix      = $line_chart.data( 'tooltip-suffix' ) || '',
            tooltip_separator   = $line_chart.data( 'tooltip-separator' ) || '';

        if ( ! $line_chart.length ) {
            return;
        }

        JetElements.observer( $line_chart_canvas, function() {

            var $this   = $( this ),
                ctx     = $this[0].getContext( '2d' ),
                myLineChart = new Chart( ctx, settings );

                myLineChart.options.tooltips = {
                    enabled:   false,
                    mode:      'x-axis',
                    intersect: false,
                    callbacks: {
                        label: function( tooltipItem, data ) {
                            var colorBox = data.datasets[tooltipItem.datasetIndex].borderColor;
                            colorBox = colorBox.replace( /"/g, '"' );

                            if ( true === $compare ) {
                                var currentLabel    = 'custom' === compare_labels_type ? current_label : data.labels[tooltipItem.index],
                                    title           = data.datasets[tooltipItem.datasetIndex].label,
                                    currentVal      = '' != tooltip_separator ? JetElementsTools.addThousandCommaSeparator( data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index], tooltip_separator ) : data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index],
                                    current         = '<div class="jet-line-chart-tooltip-compare-current">' + currentLabel + ' : ' + tooltip_prefix + currentVal + tooltip_suffix + '</div>',
                                    previous        = '',
                                    compareColorBox = data.datasets[tooltipItem.datasetIndex].borderColor,
                                    compareColorBox = compareColorBox.replace( /"/g, '"' );

                                if ( typeof (data.labels[tooltipItem.index - 1]) != "undefined" && data.labels[tooltipItem.index - 1] !== null ) {
                                    var previousLabel = 'custom' === compare_labels_type ? previous_label : data.labels[tooltipItem.index - 1],
                                        previousVal   = '' != tooltip_separator ? JetElementsTools.addThousandCommaSeparator( data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index - 1], tooltip_separator ) : data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index - 1],
                                        previous      = '<div class="jet-line-chart-tooltip-compare-previous">' + previousLabel + ' : ' + tooltip_prefix + previousVal + tooltip_suffix + '</div>';
                                }

                                return '<div class="jet-line-chart-tooltip-title"><span class="jet-line-chart-tooltip-color-box" style="background:' + compareColorBox + '"></span>' + title + '</div><div class="jet-line-chart-tooltip-body">' + current + previous + '</div>';
                            } else {
                                var label = data.datasets[tooltipItem.datasetIndex].label,
                                    val   = '' != tooltip_separator ? JetElementsTools.addThousandCommaSeparator( data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index], tooltip_separator ) : data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                                return '<div class="jet-line-chart-tooltip-body"><span class="jet-line-chart-tooltip-color-box" style="background:' + colorBox + '"></span>' + label + ' : ' + tooltip_prefix + val + tooltip_suffix + '</div>';
                            }
                        },
                    },
                    custom: function( tooltipModel ) {
                        // Tooltip Element
                        var tooltipEl = document.getElementById( 'chartjs-tooltip_' + id );

                        // Create element on first render
                        if ( !tooltipEl ) {
                            tooltipEl = document.createElement( 'div' );
                            tooltipEl.id = 'chartjs-tooltip_' + id;
                            tooltipEl.innerHTML = '<div class="jet-line-chart-tooltip"></div>';
                            document.body.appendChild( tooltipEl );
                        }

                        // Hide if no tooltip
                        if ( tooltipModel.opacity === 0 ) {
                            tooltipEl.style.opacity = 0;
                            return;
                        }
                        // Set caret Position
                        tooltipEl.classList.remove( 'above', 'below', 'no-transform' );
                        if ( tooltipModel.yAlign ) {
                            tooltipEl.classList.add( tooltipModel.yAlign );
                        } else {
                            tooltipEl.classList.add( 'no-transform' );
                        }

                        function getBody( bodyItem ) {
                            return bodyItem.lines;
                        }

                        // Set Text
                        if ( tooltipModel.body ) {
                            var titleLines = tooltipModel.title || [];
                            var bodyLines = tooltipModel.body.map( getBody );
                            var innerHtml = '';

                            innerHtml += '<div class="jet-line-chart-tooltip-wrapper">';
                            bodyLines.forEach( function( body, i ) {
                                innerHtml += body;
                            } );
                            innerHtml += '</div>';

                            var tableRoot = tooltipEl.querySelector( 'div' );
                            tableRoot.innerHTML = innerHtml;
                        }

                        // `this` will be the overall tooltip

                        var _this         = this,
                            position      = this._chart.canvas.getBoundingClientRect(),
                            tooltipWidth  = tooltipEl.offsetWidth,
                            tooltipHeight = tooltipEl.offsetHeight,
                            offsetX       = 0,
                            offsetY       = 0;

                        setTimeout( function(){
                            tooltipWidth = tooltipEl.offsetWidth;
                            tooltipHeight = tooltipEl.offsetHeight;

                            if ( _this._chart.width / 2 > _this._chart.tooltip._eventPosition.x ) {
                                offsetX = 0;
                            } else {
                                offsetX = -tooltipWidth;
                            }

                            if ( _this._chart.height / 2 > _this._chart.tooltip._eventPosition.y ) {
                                offsetY = 0;
                            } else {
                                offsetY = -tooltipHeight;
                            }
                            tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + offsetX + 'px';
                            tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + offsetY + 'px';
                            tooltipEl.style.opacity = 1;
                        }, 10 );

                        // Display, position, and set styles for font
                        tooltipEl.style.position = 'absolute';
                        tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                        tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                        tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                        tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                        tooltipEl.style.pointerEvents = 'none';
                    },
                };
                myLineChart.update();
        }, JetElements.prepareWaypointOptions( $scope, {
            offset: 'bottom-in-view'
        } ) );
    }

    window.widgetLineChart = widgetLineChart;

})( jQuery );