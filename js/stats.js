/*Stats*/
function overallGraphsRefresh(timespan="1d"){
	fetch('https://stats.api.sdrmap.org/overall/' + timespan + '.json')
	.then(function(response) { return response.json(); })
	.then(function(data) {
		//console.log('gudelaune');
		//console.log(data);

		//buttons
		document.getElementById("overallGraphsTimespanButton1h").className = 'overallGraphsTimespanButton';
		document.getElementById("overallGraphsTimespanButton1d").className = 'overallGraphsTimespanButton';
		document.getElementById("overallGraphsTimespanButton7d").className = 'overallGraphsTimespanButton';
		document.getElementById("overallGraphsTimespanButton30d").className = 'overallGraphsTimespanButton';
		document.getElementById("overallGraphsTimespanButton1y").className = 'overallGraphsTimespanButton';
		document.getElementById("overallGraphsTimespanButton3y").className = 'overallGraphsTimespanButton';
		document.getElementById("overallGraphsTimespanButton" + timespan).className = 'overallGraphsTimespanButtonActive';

		var overallGraphs = [
			'overallGraphAdsbDoughnut',
			'overallGraphAdsbTypeDoughnut',
			'overallGraphAdsb',
			'overallGraphAdsbType',
			'overallGraphAisDoughnut',
			'overallGraphAisTypeDoughnut',
			'overallGraphAis',
			'overallGraphAisType',
			'overallGraphRadiosondesDoughnut',
			'overallGraphRadiosondesTypeDoughnut',
			'overallGraphRadiosondes',
			'overallGraphRadiosondesType',
			'overallGraphStationsDoughnut',
			'overallGraphStationsTypeBar',
			'overallGraphStations',
			'overallGraphStationsType'
		];

		overallGraphs.forEach(function (graph) {
			if(Chart.getChart(graph) !== undefined) {
				Chart.getChart(graph).destroy();
			}
		});
		
		var onepercent = (Object.values(data.adsb.fix.true).reduce((a, b) => a + b, 0) + Object.values(data.adsb.fix.mlat).reduce((a, b) => a + b, 0) + Object.values(data.adsb.fix.false).reduce((a, b) => a + b, 0))/100;
		new Chart(
			document.getElementById('overallGraphAdsbDoughnut'),
			{
				type: 'doughnut',
				//type: 'pie',
				options: {
					responsive: true,
					aspectRatio: 2,
					plugins: {
						legend: {
							position: 'bottom',
							labels: {
								color: 'white'
							}
						},
						title: {
							display: true,
							text: 'sdrmap.org',
							color: 'white'
						},
						subtitle: {
							display: true,
							text: 'ADS-B aircrafts by fix',
							color: 'white'
						},
					}
				},
				data: {
					labels: ['ADS-B fix', 'MLAT', 'no fix'],
					datasets: [
						{
							data: [Object.values(data.adsb.fix.true).reduce((a, b) => a + b, 0)/onepercent, Object.values(data.adsb.fix.mlat).reduce((a, b) => a + b, 0)/onepercent, Object.values(data.adsb.fix.false).reduce((a, b) => a + b, 0)/onepercent],
							backgroundColor: ['#0f0','orange','red'],
							borderColor: ['#0f0','orange','red']
						}
					]
				}
			}
		);
		
		var onepercent = Object.values(data.adsb.total).reduce((a, b) => a + b, 0)/100;
		var other = Object.values(data.adsb.total).reduce((a, b) => a + b, 0)-(Object.values(data.adsb.type.bos).reduce((a, b) => a + b, 0) + Object.values(data.adsb.type.int).reduce((a, b) => a + b, 0) + Object.values(data.adsb.type.mil).reduce((a, b) => a + b, 0));
		new Chart(
			document.getElementById('overallGraphAdsbTypeDoughnut'),
			{
				type: 'doughnut',
				//type: 'pie',
				options: {
					responsive: true,
					aspectRatio: 2,
					plugins: {
						legend: {
							position: 'bottom',
							labels: {
								color: 'white'
							}
						},
						title: {
							display: true,
							text: 'sdrmap.org',
							color: 'white'
						},
						subtitle: {
							display: true,
							text: 'ADS-B aircrafts by type',
							color: 'white'
						},
					}
				},
				data: {
					labels: ['bos', 'int', 'mil', 'other'],
					datasets: [
						{
							data: [Object.values(data.adsb.type.bos).reduce((a, b) => a + b, 0)/onepercent, Object.values(data.adsb.type.int).reduce((a, b) => a + b, 0)/onepercent, Object.values(data.adsb.type.mil).reduce((a, b) => a + b, 0)/onepercent, other/onepercent],
							backgroundColor: ['red','#ff00c3','#0f0','#2b72d7'],
							borderColor: ['red','#ff00c3','#0f0','#2b72d7']
						}
					]
				}
			}
		);
		
		new Chart(
			document.getElementById('overallGraphAdsb'),
			{
				type: 'line',
				options: {
					//spanGaps: 1000 * 60 * 60 * 24 * 2,
					responsive: true,
					pointStyle: false,
					elements: {
						line: {
							tension: 0
						}
					},
					interaction: {
						mode: 'index',
						intersect: false
					},
					scales: {
						y: {
							title: {
								display: true,
								text: '# of aircrafts',
								color: 'white'
							},
							min: 0,
							border: {
								color: '#656565'
							},
							grid: {
								color: '#656565',
							},
							ticks: {
								color: 'white',
							}
						},
						x: {
							type: 'time',
							time: {
								tooltipFormat: 'D.M. HH:mm',
								displayFormats: {
									minute: 'D.M. HH:mm'
								}
							},
							//
							border: {
								color: '#656565'
							},
							grid: {
								color: '#656565',
							},
							ticks: {
								callback: function(val, index) {
									//console.log(index);
									// Hide every 2nd tick label
									return index % 2 === 0 ? this.getLabelForValue(val) : '';
								  },
								color: 'white',
							}
						}
					},
					plugins: {
						legend: {
							position: 'bottom',
							labels: {
								color: 'white'
							}
						},
						title: {
							display: true,
							text: 'sdrmap.org',
							color: 'white'
						},
						subtitle: {
							display: true,
							text: 'ADS-B aircrafts by fix',
							color: 'white'
						}
					}
				},
				plugins: [vLine],
				data: {
					labels: Object.keys(data.adsb.total).map((x) => x * 1000),
					datasets: [
						{
							label: 'Total',
							data: Object.values(data.adsb.total),
							borderColor: '#2b72d7',
							backgroundColor: '#2b72d7'
						},
						{
							label: 'ADS-B fix',
							data: Object.values(data.adsb.fix.true),
							borderColor: '#0f0',
							backgroundColor: '#0f0'
						},
						{
							label: 'MLAT',
							data: Object.values(data.adsb.fix.mlat),
							//data: null,
							borderColor: 'orange',
							backgroundColor: 'orange'
						},
						{
							label: 'no fix',
							data: Object.values(data.adsb.fix.false),
							//data: null,
							borderColor: 'red',
							backgroundColor: 'red'
						}
					]
				}
			}
		);
		new Chart(
			document.getElementById('overallGraphAdsbType'),
			{
				type: 'line',
				options: {
					//spanGaps: 1000 * 60 * 60 * 24 * 2,
					responsive: true,
					pointStyle: false,
					elements: {
						line: {
							tension: 0
						}
					},
					interaction: {
						mode: 'index',
						intersect: false
					},
					scales: {
						y: {
							title: {
								display: true,
								text: '# of aircrafts',
								color: 'white'
							},
							min: 0,
							border: {
								color: '#656565'
							},
							grid: {
								color: '#656565',
							},
							ticks: {
								color: 'white',
							}
						},
						x: {
							type: 'time',
							time: {
								tooltipFormat: 'D.M. HH:mm',
								displayFormats: {
									minute: 'D.M. HH:mm'
								}
							},
							//
							border: {
								color: '#656565'
							},
							grid: {
								color: '#656565',
							},
							ticks: {
								callback: function(val, index) {
									// Hide every 2nd tick label
									return index % 2 === 0 ? this.getLabelForValue(val) : '';
								  },
								color: 'white',
							}
						}
					},
					plugins: {
						legend: {
							position: 'bottom',
							labels: {
								color: 'white'
							}
						},
						title: {
							display: true,
							text: 'sdrmap.org',
							color: 'white'
						},
						subtitle: {
							display: true,
							text: 'ADS-B aircrafts by type',
							color: 'white'
						}
					}
				},
				plugins: [vLine],
				data: {
					labels: Object.keys(data.adsb.type.bos).map((x) => x * 1000),
					datasets: [
						{
							label: 'bos',
							data: Object.values(data.adsb.type.bos),
							borderColor: '#f00',
							backgroundColor: '#f00'
						},
						{
							label: 'int',
							data: Object.values(data.adsb.type.int),
							//data: null,
							borderColor: '#ff00c3',
							backgroundColor: '#ff00c3'
						},
						{
							label: 'mil',
							data: Object.values(data.adsb.type.mil),
							//data: null,
							borderColor: '#0f0',
							backgroundColor: '#0f0'
						}
					]
				}
			}
		);
		//ais
		var onepercent = (Object.values(data.ais.fix.true).reduce((a, b) => a + b, 0) + Object.values(data.ais.fix.false).reduce((a, b) => a + b, 0))/100;
		new Chart(
			document.getElementById('overallGraphAisDoughnut'),
			{
				type: 'doughnut',
				//type: 'pie',
				options: {
					responsive: true,
					aspectRatio: 2,
					plugins: {
						legend: {
							position: 'bottom',
							labels: {
								color: 'white'
							}
						},
						title: {
							display: true,
							text: 'sdrmap.org',
							color: 'white'
						},
						subtitle: {
							display: true,
							text: 'AIS vessels by fix',
							color: 'white'
						},
					}
				},
				data: {
					labels: ['fix', 'no fix'],
					datasets: [
						{
							data: [Object.values(data.ais.fix.true).reduce((a, b) => a + b, 0)/onepercent, Object.values(data.ais.fix.false).reduce((a, b) => a + b, 0)/onepercent],
							backgroundColor: ['#0f0','red'],
							borderColor: ['#0f0','red']
						}
					]
				}
			}
		);
		
		var onepercent = Object.values(data.ais.total).reduce((a, b) => a + b, 0)/100;
		var other = Object.values(data.ais.total).reduce((a, b) => a + b, 0)-(Object.values(data.ais.type.bos).reduce((a, b) => a + b, 0) + Object.values(data.ais.type.int).reduce((a, b) => a + b, 0) + Object.values(data.ais.type.mil).reduce((a, b) => a + b, 0));
		new Chart(
			document.getElementById('overallGraphAisTypeDoughnut'),
			{
				type: 'doughnut',
				//type: 'pie',
				options: {
					responsive: true,
					aspectRatio: 2,
					plugins: {
						legend: {
							position: 'bottom',
							labels: {
								color: 'white'
							}
						},
						title: {
							display: true,
							text: 'sdrmap.org',
							color: 'white'
						},
						subtitle: {
							display: true,
							text: 'AIS vessels by type',
							color: 'white'
						},
					}
				},
				data: {
					labels: ['bos', 'int', 'mil', 'other'],
					datasets: [
						{
							data: [Object.values(data.ais.type.bos).reduce((a, b) => a + b, 0)/onepercent, Object.values(data.ais.type.int).reduce((a, b) => a + b, 0)/onepercent, Object.values(data.ais.type.mil).reduce((a, b) => a + b, 0)/onepercent, other/onepercent],
							backgroundColor: ['red','#ff00c3','#0f0','#2b72d7'],
							borderColor: ['red','#ff00c3','#0f0','#2b72d7']
						}
					]
				}
			}
		);	
		new Chart(
			document.getElementById('overallGraphAis'),
			{
				type: 'line',
				options: {
					//spanGaps: 1000 * 60 * 60 * 24 * 2,
					responsive: true,
					pointStyle: false,
					elements: {
						line: {
							tension: 0
						}
					},
					interaction: {
						mode: 'index',
						intersect: false
					},
					scales: {
						y: {
							title: {
								display: true,
								text: '# of vessels',
								color: 'white'
							},
							min: 0,
							border: {
								color: '#656565'
							},
							grid: {
								color: '#656565',
							},
							ticks: {
								color: 'white',
							}
						},
						x: {
							type: 'time',
							time: {
								tooltipFormat: 'D.M. HH:mm',
								displayFormats: {
									minute: 'D.M. HH:mm'
								}
							},
							//
							border: {
								color: '#656565'
							},
							grid: {
								color: '#656565',
							},
							ticks: {
								callback: function(val, index) {
									// Hide every 2nd tick label
									return index % 2 === 0 ? this.getLabelForValue(val) : '';
								  },
								color: 'white',
							}
						}
					},
					plugins: {
						legend: {
							position: 'bottom',
							labels: {
								color: 'white'
							}
						},
						title: {
							display: true,
							text: 'sdrmap.org',
							color: 'white'
						},
						subtitle: {
							display: true,
							text: 'AIS vessels by fix',
							color: 'white'
						}
					}
				},
				plugins: [vLine],
				data: {
					labels: Object.keys(data.ais.total).map((x) => x * 1000),
					datasets: [
						{
							label: 'Total',
							data: Object.values(data.ais.total),
							borderColor: '#2b72d7',
							backgroundColor: '#2b72d7'
						},
						{
							label: 'fix',
							data: Object.values(data.ais.fix.true),
							borderColor: '#0f0',
							backgroundColor: '#0f0'
						},
						{
							label: 'no fix',
							data: Object.values(data.ais.fix.false),
							//data: null,
							borderColor: 'red',
							backgroundColor: 'red'
						}
					]
				}
			}
		);
		new Chart(
			document.getElementById('overallGraphAisType'),
			{
				type: 'line',
				options: {
					//spanGaps: 1000 * 60 * 60 * 24 * 2,
					responsive: true,
					pointStyle: false,
					elements: {
						line: {
							tension: 0
						}
					},
					interaction: {
						mode: 'index',
						intersect: false
					},
					scales: {
						y: {
							title: {
								display: true,
								text: '# of vessels',
								color: 'white'
							},
							min: 0,
							border: {
								color: '#656565'
							},
							grid: {
								color: '#656565',
							},
							ticks: {
								color: 'white',
							}
						},
						x: {
							type: 'time',
							time: {
								tooltipFormat: 'D.M. HH:mm',
								displayFormats: {
									minute: 'D.M. HH:mm'
								}
							},
							//
							border: {
								color: '#656565'
							},
							grid: {
								color: '#656565',
							},
							ticks: {
								callback: function(val, index) {
									// Hide every 2nd tick label
									return index % 2 === 0 ? this.getLabelForValue(val) : '';
								  },
								color: 'white',
							}
						}
					},
					plugins: {
						legend: {
							position: 'bottom',
							labels: {
								color: 'white'
							}
						},
						title: {
							display: true,
							text: 'sdrmap.org',
							color: 'white'
						},
						subtitle: {
							display: true,
							text: 'AIS vessels by type',
							color: 'white'
						}
					}
				},
				plugins: [vLine],
				data: {
					labels: Object.keys(data.ais.type.bos).map((x) => x * 1000),
					datasets: [
						{
							label: 'bos',
							data: Object.values(data.ais.type.bos),
							borderColor: '#f00',
							backgroundColor: '#f00'
						},
						{
							label: 'int',
							data: Object.values(data.ais.type.int),
							//data: null,
							borderColor: '#ff00c3',
							backgroundColor: '#ff00c3'
						},
						{
							label: 'mil',
							data: Object.values(data.ais.type.mil),
							//data: null,
							borderColor: '#0f0',
							backgroundColor: '#0f0'
						}
					]
				}
			}
		);
		//radiosondes
		var onepercent = (Object.values(data.radiosondes.fix.true).reduce((a, b) => a + b, 0) + Object.values(data.radiosondes.fix.false).reduce((a, b) => a + b, 0))/100;
		new Chart(
			document.getElementById('overallGraphRadiosondesDoughnut'),
			{
				type: 'doughnut',
				//type: 'pie',
				options: {
					responsive: true,
					aspectRatio: 2,
					plugins: {
						legend: {
							position: 'bottom',
							labels: {
								color: 'white'
							}
						},
						title: {
							display: true,
							text: 'sdrmap.org',
							color: 'white'
						},
						subtitle: {
							display: true,
							text: 'radiosondes by fix',
							color: 'white'
						},
					}
				},
				data: {
					labels: ['fix', 'no fix'],
					datasets: [
						{
							data: [Object.values(data.radiosondes.fix.true).reduce((a, b) => a + b, 0)/onepercent, Object.values(data.radiosondes.fix.false).reduce((a, b) => a + b, 0)/onepercent],
							backgroundColor: ['#0f0','red'],
							borderColor: ['#0f0','red']
						}
					]
				}
			}
		);
		
		var onepercent = Object.values(data.radiosondes.total).reduce((a, b) => a + b, 0)/100;
		var other = Object.values(data.radiosondes.total).reduce((a, b) => a + b, 0)-(Object.values(data.radiosondes.type.bos).reduce((a, b) => a + b, 0) + Object.values(data.radiosondes.type.int).reduce((a, b) => a + b, 0) + Object.values(data.radiosondes.type.mil).reduce((a, b) => a + b, 0));
		new Chart(
			document.getElementById('overallGraphRadiosondesTypeDoughnut'),
			{
				type: 'doughnut',
				//type: 'pie',
				options: {
					responsive: true,
					aspectRatio: 2,
					plugins: {
						legend: {
							position: 'bottom',
							labels: {
								color: 'white'
							}
						},
						title: {
							display: true,
							text: 'sdrmap.org',
							color: 'white'
						},
						subtitle: {
							display: true,
							text: 'radiosondes by type',
							color: 'white'
						},
					}
				},
				data: {
					labels: ['bos', 'int', 'mil', 'other'],
					datasets: [
						{
							data: [Object.values(data.radiosondes.type.bos).reduce((a, b) => a + b, 0)/onepercent, Object.values(data.radiosondes.type.int).reduce((a, b) => a + b, 0)/onepercent, Object.values(data.radiosondes.type.mil).reduce((a, b) => a + b, 0)/onepercent, other/onepercent],
							backgroundColor: ['red','#ff00c3','#0f0','#2b72d7'],
							borderColor: ['red','#ff00c3','#0f0','#2b72d7']
						}
					]
				}
			}
		);
		new Chart(
			document.getElementById('overallGraphRadiosondes'),
			{
				type: 'line',
				options: {
					//spanGaps: 1000 * 60 * 60 * 24 * 2,
					responsive: true,
					pointStyle: false,
					elements: {
						line: {
							tension: 0
						}
					},
					interaction: {
						mode: 'index',
						intersect: false
					},
					scales: {
						y: {
							title: {
								display: true,
								text: '# of radiosondes',
								color: 'white'
							},
							min: 0,
							border: {
								color: '#656565'
							},
							grid: {
								color: '#656565',
							},
							ticks: {
								color: 'white',
							}
						},
						x: {
							type: 'time',
							time: {
								tooltipFormat: 'D.M. HH:mm',
								displayFormats: {
									minute: 'D.M. HH:mm'
								}
							},
							//
							border: {
								color: '#656565'
							},
							grid: {
								color: '#656565',
							},
							ticks: {
								callback: function(val, index) {
									// Hide every 2nd tick label
									return index % 2 === 0 ? this.getLabelForValue(val) : '';
								  },
								color: 'white',
							}
						}
					},
					plugins: {
						legend: {
							position: 'bottom',
							labels: {
								color: 'white'
							}
						},
						title: {
							display: true,
							text: 'sdrmap.org',
							color: 'white'
						},
						subtitle: {
							display: true,
							text: 'Radiosondes by fix',
							color: 'white'
						}
					}
				},
				plugins: [vLine],
				data: {
					labels: Object.keys(data.radiosondes.total).map((x) => x * 1000),
					datasets: [
						{
							label: 'Total',
							data: Object.values(data.radiosondes.total),
							borderColor: '#2b72d7',
							backgroundColor: '#2b72d7'
						},
						{
							label: 'fix',
							data: Object.values(data.radiosondes.fix.true),
							borderColor: '#0f0',
							backgroundColor: '#0f0'
						},
						{
							label: 'no fix',
							data: Object.values(data.radiosondes.fix.false),
							//data: null,
							borderColor: 'red',
							backgroundColor: 'red'
						}
					]
				}
			}
		);
		new Chart(
			document.getElementById('overallGraphRadiosondesType'),
			{
				type: 'line',
				options: {
					//spanGaps: 1000 * 60 * 60 * 24 * 2,
					responsive: true,
					pointStyle: false,
					elements: {
						line: {
							tension: 0
						}
					},
					interaction: {
						mode: 'index',
						intersect: false
					},
					scales: {
						y: {
							title: {
								display: true,
								text: '# of radiosondes',
								color: 'white'
							},
							min: 0,
							border: {
								color: '#656565'
							},
							grid: {
								color: '#656565',
							},
							ticks: {
								color: 'white',
							}
						},
						x: {
							type: 'time',
							time: {
								tooltipFormat: 'D.M. HH:mm',
								displayFormats: {
									minute: 'D.M. HH:mm'
								}
							},
							//
							border: {
								color: '#656565'
							},
							grid: {
								color: '#656565',
							},
							ticks: {
								callback: function(val, index) {
									// Hide every 2nd tick label
									return index % 2 === 0 ? this.getLabelForValue(val) : '';
								  },
								color: 'white',
							}
						}
					},
					plugins: {
						legend: {
							position: 'bottom',
							labels: {
								color: 'white'
							}
						},
						title: {
							display: true,
							text: 'sdrmap.org',
							color: 'white'
						},
						subtitle: {
							display: true,
							text: 'radiosondes by type',
							color: 'white'
						}
					}
				},
				plugins: [vLine],
				data: {
					labels: Object.keys(data.radiosondes.type.bos).map((x) => x * 1000),
					datasets: [
						{
							label: 'bos',
							data: Object.values(data.radiosondes.type.bos),
							borderColor: '#f00',
							backgroundColor: '#f00'
						},
						{
							label: 'int',
							data: Object.values(data.radiosondes.type.int),
							//data: null,
							borderColor: '#ff00c3',
							backgroundColor: '#ff00c3'
						},
						{
							label: 'mil',
							data: Object.values(data.radiosondes.type.mil),
							//data: null,
							borderColor: '#0f0',
							backgroundColor: '#0f0'
						}
					]
				}
			}
		);
		//statione
		var onepercent = Object.values(data.stations.total).reduce((a, b) => a + b, 0)/100;
		new Chart(
			document.getElementById('overallGraphStationsDoughnut'),
			{
				type: 'doughnut',
				//type: 'pie',
				options: {
					responsive: true,
					aspectRatio: 2,
					plugins: {
						legend: {
							position: 'bottom',
							labels: {
								color: 'white'
							}
						},
						title: {
							display: true,
							text: 'sdrmap.org',
							color: 'white'
						},
						subtitle: {
							display: true,
							text: 'Stations by status',
							color: 'white'
						},
					}
				},
				data: {
					labels: ['online', 'partially online', 'offline'],
					datasets: [
						{
							data: [Object.values(data.stations.status.online).reduce((a, b) => a + b, 0)/onepercent, Object.values(data.stations.status.partiallyonline).reduce((a, b) => a + b, 0)/onepercent, Object.values(data.stations.status.offline).reduce((a, b) => a + b, 0)/onepercent],
							backgroundColor: ['#0f0','yellow','red'],
							borderColor: ['#0f0','yellow','red']
						}
					]
				}
			}
		);
		console.log(Object.values(data.stations.services.adsb)[Object.keys(data.stations.services.adsb).length - 2]);
		console.log(Object.keys(data.stations.services.adsb)[Object.keys(data.stations.services.adsb).length - 1]);
		console.log(Object.keys(data.stations.services.adsb).length - 1);
		console.log(Object.keys(data.stations.services.adsb).length);
		console.log(data.stations.services.adsb);
		new Chart(
			document.getElementById('overallGraphStationsTypeBar'),
			{
				type: 'bar',
				//type: 'pie',
				options: {
					responsive: true,
					aspectRatio: 2,
					scales: {
						y: {
							title: {
								display: true,
								text: '# of stations',
								color: 'white'
							},
							min: 0,
							border: {
								color: '#656565'
							},
							grid: {
								color: '#656565',
							},
							ticks: {
								color: 'white',
							}
						},
						x: {
							border: {
								color: '#656565'
							},
							grid: {
								color: '#656565',
							},
							ticks: {
								color: 'white',
							}
						}
					},
					plugins: {
						legend: {
							display: false
						},
						title: {
							display: true,
							text: 'sdrmap.org',
							color: 'white'
						},
						subtitle: {
							display: true,
							text: 'Stations by service',
							color: 'white'
						},
					}
				},
				data: {
					labels: ['adsb', 'mlat', 'ais', 'radiosonde', 'feeder'],
					datasets: [
						{
							data: [Object.values(data.stations.services.adsb)[Object.keys(data.stations.services.adsb).length - 2], Object.values(data.stations.services.mlat)[Object.keys(data.stations.services.mlat).length - 2], Object.values(data.stations.services.ais)[Object.keys(data.stations.services.ais).length - 2], Object.values(data.stations.services.radiosonde)[Object.keys(data.stations.services.radiosonde).length - 2], Object.values(data.stations.services.feeder)[Object.keys(data.stations.services.feeder).length - 2]],
							backgroundColor: ['#0f0','orange','#2b72d7','#ff00c3','white'],
							borderColor: ['#0f0','orange','#2b72d7','#ff00c3','white']
						}
					]
				}
			}
		);
		new Chart(
			document.getElementById('overallGraphStations'),
			{
				type: 'line',
				options: {
					//spanGaps: 1000 * 60 * 60 * 24 * 2,
					responsive: true,
					pointStyle: false,
					elements: {
						line: {
							tension: 0
						}
					},
					interaction: {
						mode: 'index',
						intersect: false
					},
					scales: {
						y: {
							title: {
								display: true,
								text: '# of stations',
								color: 'white'
							},
							min: 0,
							border: {
								color: '#656565'
							},
							grid: {
								color: '#656565',
							},
							ticks: {
								color: 'white',
							}
						},
						x: {
							type: 'time',
							time: {
								tooltipFormat: 'D.M. HH:mm',
								displayFormats: {
									minute: 'D.M. HH:mm'
								}
							},
							//
							border: {
								color: '#656565'
							},
							grid: {
								color: '#656565',
							},
							ticks: {
								callback: function(val, index) {
									// Hide every 2nd tick label
									return index % 2 === 0 ? this.getLabelForValue(val) : '';
								  },
								color: 'white',
							}
						}
					},
					plugins: {
						legend: {
							position: 'bottom',
							labels: {
								color: 'white'
							}
						},
						title: {
							display: true,
							text: 'sdrmap.org',
							color: 'white'
						},
						subtitle: {
							display: true,
							text: 'stations',
							color: 'white'
						}
					}
				},
				plugins: [vLine],
				data: {
					labels: Object.keys(data.stations.total).map((x) => x * 1000),
					datasets: [
						{
							label: 'total',
							data: Object.values(data.stations.total),
							borderColor: '#2b72d7',
							backgroundColor: '#2b72d7'
						},
						{
							label: 'online',
							data: Object.values(data.stations.status.online),
							borderColor: '#0f0',
							backgroundColor: '#0f0'
						},
						{
							label: 'partially online',
							data: Object.values(data.stations.status.partiallyonline),
							//data: null,
							borderColor: 'yellow',
							backgroundColor: 'yellow'
						},
						{
							label: 'offline',
							data: Object.values(data.stations.status.offline),
							//data: null,
							borderColor: '#f00',
							backgroundColor: '#f00'
						}
					]
				}
			}
		);
		new Chart(
			document.getElementById('overallGraphStationsType'),
			{
				type: 'line',
				options: {
					//spanGaps: 1000 * 60 * 60 * 24 * 2,
					responsive: true,
					pointStyle: false,
					elements: {
						line: {
							tension: 0
						}
					},
					interaction: {
						mode: 'index',
						intersect: false
					},
					scales: {
						y: {
							title: {
								display: true,
								text: '# of stations',
								color: 'white'
							},
							min: 0,
							border: {
								color: '#656565'
							},
							grid: {
								color: '#656565',
							},
							ticks: {
								color: 'white',
							}
						},
						x: {
							type: 'time',
							time: {
								tooltipFormat: 'D.M. HH:mm',
								displayFormats: {
									minute: 'D.M. HH:mm'
								}
							},
							//
							border: {
								color: '#656565'
							},
							grid: {
								color: '#656565',
							},
							ticks: {
								callback: function(val, index) {
									// Hide every 2nd tick label
									return index % 2 === 0 ? this.getLabelForValue(val) : '';
								  },
								color: 'white',
							}
						}
					},
					plugins: {
						legend: {
							position: 'bottom',
							labels: {
								color: 'white'
							}
						},
						title: {
							display: true,
							text: 'sdrmap.org',
							color: 'white'
						},
						subtitle: {
							display: true,
							text: 'stations by service',
							color: 'white'
						}
					}
				},
				plugins: [vLine],
				data: {
					labels: Object.keys(data.stations.services.adsb).map((x) => x * 1000),
					datasets: [
						{
							label: 'adsb',
							data: Object.values(data.stations.services.adsb),
							borderColor: '#0f0',
							backgroundColor: '#0f0'
						},
						{
							label: 'mlat',
							data: Object.values(data.stations.services.mlat),
							//data: null,
							borderColor: 'orange',
							backgroundColor: 'orange'
						},
						{
							label: 'ais',
							data: Object.values(data.stations.services.ais),
							//data: null,
							borderColor: '#2b72d7',
							backgroundColor: '#2b72d7'
						},
						{
							label: 'radiosondes',
							data: Object.values(data.stations.services.radiosonde),
							//data: null,
							borderColor: '#ff00c3',
							backgroundColor: '#ff00c3'
						},
						{
							label: 'feeder',
							data: Object.values(data.stations.services.feeder),
							//data: null,
							borderColor: 'white',
							backgroundColor: 'white'
						}
					]
				}
			}
		);
	});
}

function overallGraphsTimespanSet(t){
	overallGraphsTimespan = t;
	overallGraphsBigRefresh();
	document.getElementById("overallGraphsTimespanButton1h").className = 'overallGraphsTimespanButton';
	document.getElementById("overallGraphsTimespanButton1d").className = 'overallGraphsTimespanButton';
	document.getElementById("overallGraphsTimespanButton7d").className = 'overallGraphsTimespanButton';
	document.getElementById("overallGraphsTimespanButton30d").className = 'overallGraphsTimespanButton';
	document.getElementById("overallGraphsTimespanButton1y").className = 'overallGraphsTimespanButton';
	document.getElementById("overallGraphsTimespanButton3y").className = 'overallGraphsTimespanButton';
	document.getElementById("overallGraphsTimespanButton" + t).className = 'overallGraphsTimespanButtonActive';
}
