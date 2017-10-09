myApp.controller('AdminReportingController', ['AdminService', '$mdDialog', '$timeout', '$mdSidenav', '$log', function (AdminService, $mdDialog, $timeout, $mdSidenav, $log) {


    //--------------------------------------
    //-------------VARIABLES----------------
    //--------------------------------------


    var self = this;

    self.AdminService = AdminService;

    // List of calculations we support for reporting
    self.calcList = [
        "Demographics Report",
        "Basic Questions"
    ]

    self.chartData = AdminService.chartData; // actual data is in .list property, which is an array of objects


    const START_YEAR = 2010;
    var thisYear = new Date();
    thisYear = thisYear.getFullYear();
    self.yearsArray = [];

    for (var i = thisYear; i >= START_YEAR; i--) {
        self.yearsArray.push(i);
    }

    self.propertiesToGet = [];

    self.propertyList = AdminService.propertyList; // list of unique properties in .list

    var ctx = document.getElementById("myChart").getContext("2d");



    //--------------------------------------
    //-------------FUNCTIONS----------------
    //--------------------------------------

    // add property to list of properties to get from db
    self.addProperty = function (newProperty) {
        console.log('addProperty', newProperty);

        if (newProperty != undefined) {
            console.log('defined');

            if (newProperty.length > 0) {
                // look for duplicate
                console.log('length > 0');

                var index = self.propertiesToGet.indexOf(newProperty);
                console.log('index', index);

                if (index == -1) {
                    console.log('index ok');

                    self.propertiesToGet.push(newProperty);
                    self.typedProperty = null;
                }
            }
        }
    }

    // remove property from list of properties to get from db
    self.deleteProperty = function (property) {
        console.log('deleteProperty', property);
        var index = self.propertiesToGet.indexOf(property);
        self.propertiesToGet.splice(index, 1);
    }


    // Toggle Sidenav
    self.openLeftMenu = function () {
        $mdSidenav('left').toggle();
    };

    // takes a string based on user input, and gets the data and builds a chart based on that
    self.runCalc = function (calc) {
        console.log('arc.runCalc', calc);
        switch (calc) {
            case "Demographics Report":
                domElement = ctx; // where we're going to build the chart
                AdminService.getData(self.yearToGet, self.propertiesToGet, 'demographics', domElement);
                // we have to send the DOM element to build the chart in to the service, because we don't seem to be able to data-bind the dataset inside the chart constructor
                break;
            default:
                console.log('arc.runCalc NYI');
        }


    }




    //--------------------------------------
    //-------------RUNTIME CODE-------------
    //--------------------------------------

    // none

}]);













    // // build test chart
    // self.chartTest = function () {
    //     console.log('arc.chartTest()');

    //     AdminService.buildTestChart();

    //     console.log('arc.chartData.list', self.chartData.list);
    //     var myChart = new Chart(ctx, {
    //         type: 'bar',
    //         data: {
    //             labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    //             datasets: [{
    //                 label: '# of Votes',
    //                 data: self.chartData.list,
    //                 backgroundColor: [
    //                     'rgba(255, 99, 132, 0.2)',
    //                     'rgba(54, 162, 235, 0.2)',
    //                     'rgba(255, 206, 86, 0.2)',
    //                     'rgba(75, 192, 192, 0.2)',
    //                     'rgba(153, 102, 255, 0.2)',
    //                     'rgba(255, 159, 64, 0.2)'
    //                 ],
    //                 borderColor: [
    //                     'rgba(255,99,132,1)',
    //                     'rgba(54, 162, 235, 1)',
    //                     'rgba(255, 206, 86, 1)',
    //                     'rgba(75, 192, 192, 1)',
    //                     'rgba(153, 102, 255, 1)',
    //                     'rgba(255, 159, 64, 1)'
    //                 ],
    //                 borderWidth: 1
    //             }]
    //         },
    //         options: {
    //             scales: {
    //                 yAxes: [{
    //                     ticks: {
    //                         beginAtZero: true
    //                     }
    //                 }]
    //             }
    //         }
    //     });

    // }

    // self.getData([2017, 2018], ['1822 Park', 'The Jourdain']);
