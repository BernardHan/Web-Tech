
function sortCongress(jsonData, key, ascending) {
    "use strict";
    jsonData.sort(function (a, b) {
        if (key.length === 1) {
            if (ascending) {
                return (a[key[0]] > b[key[0]]) ? 1 : ((a[key[0]] < b[key[0]]) ? -1 : 0);
            } else {
                return (b[key[0]] > a[key[0]]) ? 1 : ((b[key[0]] < a[key[0]]) ? -1 : 0);
            }
        } else if (key.length === 2) {
            if (ascending) {
                if (a[key[0]] > b[key[0]]) {
                    // a state > b
                    return 1;
                } else if (a[key[0]] < b[key[0]]) {
                    return -1;
                } else {
                    return (a[key[1]] > b[key[1]]) ? 1 : ((a[key[1]] < b[key[1]]) ? -1 : 0);
                }
            } else {
                if (a[key[0]] < b[key[0]]) {
                    // a state > b
                    return 1;
                } else if (a[key[0]] > b[key[0]]) {
                    return -1;
                } else {
                    return (a[key[1]] < b[key[1]]) ? 1 : ((a[key[1]] > b[key[1]]) ? -1 : 0);
                }
            }
        }
        
    });
}

function searchChamberData(jsonData, chamber) {
    "use strict";

    var person, i, result = [];
    // json is already sorted by state, then by last name already, so just iterate through, stop when it's not the target state
    for (i = 0; i < jsonData.length; i += 1) {
        person = jsonData[i];
        if (person.chamber === chamber) {
            result.push(person);
        }
    }
    
    return result;
}


function dateBar(start, end, current) {
    "use strict";
    // yyyy-mm-dd
    var startY, endY, currentY, startM, endM, currentM, startD, endD, currentD, startDays, endDays, currentDays;
    startY = parseInt(start.slice(0, 4), 10);
    startM = parseInt(start.slice(5, 7), 10);
    startD = parseInt(start.slice(8, 10), 10);

    endY = parseInt(end.slice(0, 4), 10);
    endM = parseInt(end.slice(5, 7), 10);
    endD = parseInt(end.slice(8, 10), 10);
    
    currentY = parseInt(current.slice(0, 4), 10);
    currentM = parseInt(current.slice(5, 7), 10);
    currentD = parseInt(current.slice(8, 10), 10);
    
    startDays = startY * 365 + startM * 31 + startD;
    endDays = endY * 365 + endM * 31 + endD;
    currentDays = currentY * 365 + currentM * 31 + currentD;
    
    return Math.round((currentDays - startDays) / (endDays - startDays) * 100);
    
}

/*jslint white:true */
/*global angular*/
/*jslint browser: true*/
/*global $, jQuery, alert*/
var app = angular.module('congressApp', ['angularUtils.directives.dirPagination','ui.bootstrap']);
app.controller('congressController', function ($scope, $http) {
    "use strict";
    
    /* php request for legislator */
    $http({
            method: 'GET',
            url: 'http://sample-env.vjpnd4wkak.us-west-2.elasticbeanstalk.com/index.php?congress=legislators&chamber=state'
        }).then(function success(response) {
            $scope.legislatorAllData = response.data.results;
            sortCongress($scope.legislatorAllData, ["state_name", "last_name"], true);
            $scope.legislatorStateData = $scope.legislatorAllData;
            $scope.legislatorHouseData = searchChamberData($scope.legislatorAllData, "house");
            sortCongress($scope.legislatorHouseData, ["last_name"], true);
            $scope.legislatorSenateData = searchChamberData($scope.legislatorAllData, "senate");
            sortCongress($scope.legislatorSenateData, ["last_name"], true);
        }, function error(response) {
            $scope.legislatorAllData = "ERORRRRRR";
        });
    
    /* php request for active bills */
    $http({
       method: 'GET',
        url: 'http://sample-env.vjpnd4wkak.us-west-2.elasticbeanstalk.com/index.php?congress=bills&bills_active=true'
    }).then(function success(response) {
            $scope.abillsData = response.data.results;
            sortCongress($scope.abillsData, ["introduced_on"], false);
        }, function error(response) {
            $scope.abillsData = "ERORRRRRR";
        });
    
    /* php request for new bills */
    $http({
       method: 'GET',
        url: 'http://sample-env.vjpnd4wkak.us-west-2.elasticbeanstalk.com/index.php?congress=bills&bills_active=false'
    }).then(function success(response) {
            $scope.nbillsData = response.data.results;
            sortCongress($scope.nbillsData, ["introduced_on"], false);
        }, function error(response) {
            $scope.nbillsData = "ERORRRRRR";
        });
    
    
    /* php request for committees */
    $http({
            method: 'GET',
            url: 'http://sample-env.vjpnd4wkak.us-west-2.elasticbeanstalk.com/index.php?congress=committees'
        }).then(function success(response) {
            $scope.comAllData = response.data.results;
            sortCongress($scope.comAllData, ["committee_id"], true);

            $scope.comHouseData = searchChamberData($scope.comAllData, "house");
        
            $scope.comSenateData = searchChamberData($scope.comAllData, "senate");
        
            $scope.comJointData = searchChamberData($scope.comAllData, "joint");
            // push favorite into all com data
            var i;
            for(i = 0; i < $scope.comHouseData.length; i++) {
                $scope.comHouseData[i].favorite = "0";
            }
            for(i = 0; i < $scope.comSenateData.length; i++) {
                $scope.comSenateData[i].favorite = "0";
            }
            for(i = 0; i < $scope.comJointData.length; i++) {
                $scope.comJointData[i].favorite = "0";
            }
        
        }, function error(response) {
            $scope.legislatorAllData = "ERORRRRRR";
        });
    
    
    $scope.contentType = 1;
    $scope.showContent = function(type) {
        $scope.contentType = type;
        
        if(type === 3) {
            // detect if this one liked before in committees
            for(i = 0; i < $scope.comHouseData.length; i++) {
                $scope.comHouseData[i].favorite = "0";
            }
            for(i = 0; i < $scope.comSenateData.length; i++) {
                $scope.comSenateData[i].favorite = "0";
            }
            for(i = 0; i < $scope.comJointData.length; i++) {
                $scope.comJointData[i].favorite = "0";
            }
            var i,j,hit;
            if(localStorage.coms != null) {
                var allData = JSON.parse(localStorage.coms);
                for(i = 0; i < allData.length; i++) {
                    hit = 0;
                    for(j = 0; j < $scope.comHouseData.length && !hit; j++) {
                        if(allData[i].committee_id === $scope.comHouseData[j].committee_id) {
                            // hit!
                            $scope.comHouseData[j].favorite = "1";
                            hit = 1;
                        } 
                    }
                    for(j = 0; j < $scope.comSenateData.length && !hit; j++) {
                        if(allData[i].committee_id === $scope.comSenateData[j].committee_id) {
                            // hit!
                            $scope.comSenateData[j].favorite = "1";
                            hit = 1;
                        }
                    }
                    for(j = 0; j < $scope.comJointData.length && !hit; j++) {
                        if(allData[i].committee_id === $scope.comJointData[j].committee_id) {
                            // hit!
                            $scope.comJointData[j].favorite = "1";
                            hit = 1;
                        }
                    }
                }
            }
        }
        
        if(type === 4) {
            // user requesting favorite page, retrieve and update now
            $scope.favLegislators = {};
            $scope.favBills = {};
            if(localStorage.legislators != null) {
                $scope.favLegislators = JSON.parse(localStorage.legislators);
            }
            if(localStorage.bills != null) {
                $scope.favBills = JSON.parse(localStorage.bills);
            }
            if(localStorage.coms != null) {
                $scope.favComs = JSON.parse(localStorage.coms);
            }
        }
    };
    $scope.showMenu = true;
    $scope.menuToggle = function() {
        $scope.showMenu = !$scope.showMenu;
        
        if(!$scope.showMenu){
            $('.content').css("width", "100%");
        } else {
            $('.content').css("width", "85%");
        }
    };
    
    $scope.stateNames = ["All States", "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", 
        "Connecticut", "Delaware", "District Of Columbia", "Florida", "Georgia", 
        "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", 
        "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
        "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", 
        "New hampshire", "New jersey", "New mexico", "New york", "North carolina", 
        "North dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode island", 
        "South carolina", "South dakota", "Tennessee", "Texas", "Utah", "Vermont", 
        "Virginia", "Washington", "West virginia", "Wisconsin", "Wyoming"];
    $scope.selectState = $scope.stateNames[0];
    $scope.filterState = $scope.selectState === $scope.stateNames[0] ? "" : $scope.selectState;
    
    $scope.updateFilter = function() {
        $scope.filterState = $scope.selectState === $scope.stateNames[0] ? "" : $scope.selectState;
    };
    
    
    $scope.legislatorFav = function(myEvent) {
        if(myEvent.currentTarget.childNodes[0].nodeName === "SPAN") {
            //already liked, now cancel it
            myEvent.currentTarget.innerHTML = "<i class='fa fa-star-o' aria-hidden='true'></i>";

            var allData = JSON.parse(localStorage.legislators);
            var i;
            for(i = 0; i < allData.length; i++) {
                if(allData[i].bioguide_id === $scope.legislatorID) {
                    // catch the entry i
                    allData.splice(i, 1);
                    break;
                }
            }
            if(allData.length == 0) {
                localStorage.removeItem("legislators");
                $scope.favLegislators = [];
            } else {
                localStorage.legislators = JSON.stringify(allData);
                // update
                $scope.favLegislators = JSON.parse(localStorage.legislators);
            }
            
        } else {
            // not liked, adding it
            myEvent.currentTarget.innerHTML = "<span class='fa-stack fa-lg'><i class='fa fa-star-o fa-stack-1x'></i><i class='fa fa-star fa-stack-1x' style='color:gold;'></i></span>";
            // collect data to string
            var stringData = {"bioguide_id":$scope.legislatorID,
                              "title":$scope.legislatorTitle,
                              "last_name":$scope.legislatorLastDetail,
                              "first_name":$scope.legislatorFirstDetail,
                              "oc_email":$scope.emailDetail,
                              "chamber":$scope.legislatorChamber,
                              "phone":$scope.phoneDetail,
                              "party":$scope.legislatorParty,
                              "term_start":$scope.termStartDetail,
                              "term_end":$scope.termEndDetail,
                              "office":$scope.officeDetail,
                              "state_name":$scope.stateDetail,
                              "fax":$scope.faxDetail,
                              "birthday":$scope.birthdayDetail,
                              "website":$scope.websiteDetail,
                              "facebook_id":$scope.legislatorFacebook,
                              "twitter_id":$scope.legislatorTwitter,
                              "photo":$scope.photoUrlDetail
                             };
            
            if(localStorage.legislators == null){
                localStorage.legislators = JSON.stringify([stringData]);
            } else {
                var allData = JSON.parse(localStorage.legislators);
                allData.push(stringData);
                localStorage.legislators = JSON.stringify(allData);
            }
            
            // update the favlegislator
            $scope.favLegislators = JSON.parse(localStorage.legislators);
        }
    };
    
    $scope.photoBaseUrl = "https://theunitedstates.io/images/congress/225x275/";
    // for legislator view detail
    $scope.legislatorDetail = function(x) {
        // detect if this one liked before
        
        $(".legislatorFavButton").html("<i class='fa fa-star-o' aria-hidden='true'></i>");
        if(localStorage.legislators != null) {
            var allData = JSON.parse(localStorage.legislators);
            var i;
            for(i = 0; i < allData.length; i++) {
                if(allData[i].bioguide_id === x.bioguide_id) {
                    // hit!
                    $(".legislatorFavButton").html("<span class='fa-stack fa-lg'><i class='fa fa-star-o fa-stack-1x'></i><i class='fa fa-star fa-stack-1x' style='color:gold;'></i></span>");
                    break;
                }
            }
        }
        
        
        
        /* Legislator info */
        $scope.legislatorTitle = x.title;
        $scope.legislatorLastDetail = x.last_name;
        $scope.legislatorFirstDetail = x.first_name;
        $scope.legislatorChamber = x.chamber;
        $scope.legislatorID = x.bioguide_id;
        $scope.legislatorParty = x.party;
        $scope.legislatorFacebook = x.facebook_id;
        $scope.legislatorTwitter = x.twitter_id;
        
        $scope.photoUrlDetail = $scope.photoBaseUrl + x.bioguide_id + ".jpg";
        $scope.titleNnameDetail = x.title + ". " + x.last_name + ", " + x.first_name;
        $scope.emailDetail = x.oc_email;
        $scope.chamberDetail = x.chamber.charAt(0).toUpperCase() + x.chamber.substr(1).toLowerCase();
        $scope.phoneDetail = x.phone;
        $scope.partyDetail = "N.A";
        if(x.party === "D"){
            $scope.partyDetail = "Democrat";
        } else if (x.party === "R") {
            $scope.partyDetail = "Republican";
        }
        $scope.termStartDetail = x.term_start;
        $scope.termEndDetail = x.term_end;
        $scope.officeDetail = x.office === null ? "N.A" : x.office;
        $scope.stateDetail = x.state_name;
        $scope.faxDetail = x.fax;
        $scope.birthdayDetail = x.birthday;
        $scope.websiteDetail = x.website === null ? "N.A" : x.website;
        $scope.facebookDetail = x.facebook_id === null ? "N.A" : "https://www.facebook.com/" + x.facebook_id;
        $scope.twitterDetail = x.twitter_id === null ? "N.A" : "https://twitter.com/" + x.twitter_id;
        $scope.date = new Date();
        $scope.currentDate = $scope.date.getFullYear() + '-' + ('0' + ($scope.date.getMonth() + 1)).slice(-2) + '-' + ('0' + $scope.date.getDate()).slice(-2);
        $scope.barDetail = dateBar($scope.termStartDetail, $scope.termEndDetail, $scope.currentDate);
        
        /* Bill info */
        $http({
           method: 'GET',
            url: 'http://sample-env.vjpnd4wkak.us-west-2.elasticbeanstalk.com/index.php?congress=bills&sponsor_id=' + x.bioguide_id
        }).then(function success(response) {
                $scope.topBills = response.data.results;
            }, function error(response) {
                $scope.topBills = "ERORRRRRR";
            });
        
        /* Committee info */
        $http({
           method: 'GET',
            url: 'http://sample-env.vjpnd4wkak.us-west-2.elasticbeanstalk.com/index.php?congress=committees&member_ids=' + x.bioguide_id
        }).then(function success(response) {
                $scope.topComs = response.data.results;
            }, function error(response) {
                $scope.topComs = "ERORRRRRR";
            });
    };
    $scope.billFav = function(myEvent) {
        if(myEvent.currentTarget.childNodes[0].nodeName === "SPAN") {
            //already liked, now cancel it
            myEvent.currentTarget.innerHTML = "<i class='fa fa-star-o' aria-hidden='true'></i>";

            var allData = JSON.parse(localStorage.bills);
            var i;
            for(i = 0; i < allData.length; i++) {
                if(allData[i].bill_id === $scope.billIdDetail) {
                    // catch the entry i
                    allData.splice(i, 1);
                    break;
                }
            }
            if(allData.length == 0) {
                localStorage.removeItem("bills");
                $scope.favBills = [];
            } else {
                localStorage.bills = JSON.stringify(allData);
                $scope.favBills = JSON.parse(localStorage.bills);
            }
        } else {
            // not liked, adding it
            myEvent.currentTarget.innerHTML = "<span class='fa-stack fa-lg'><i class='fa fa-star-o fa-stack-1x'></i><i class='fa fa-star fa-stack-1x' style='color:gold;'></i></span>";
            // collect data to string
            var stringData = {"bill_id":$scope.billIdDetail,
                              "bill_type":$scope.billTypeDetail,
                              "official_title":$scope.billTitleDetail,
                              "chamber":$scope.billChamberDetail,
                              "introduced_on":$scope.billIntroduceDetail,
                              "sponsor":{"title":$scope.billSponsorTitle,
                                         "last_name":$scope.billSponsorLast,
                                         "first_name":$scope.billSponsorFirst},
                              "history":{"active":$scope.billHistoryActive},
                              "urls":{"congress":$scope.billCongressDetail},
                              "last_version":{"version_name":$scope.billVersionDetail,
                                              "urls":{"pdf":$scope.billUrlDetail}}
                             };
            
            if(localStorage.bills == null){
                localStorage.bills = JSON.stringify([stringData]);
            } else {
                var allData = JSON.parse(localStorage.bills);
                allData.push(stringData);
                localStorage.bills = JSON.stringify(allData);
            }
            //update
            $scope.favBills = JSON.parse(localStorage.bills);

        }
    };
    
    $scope.comFav = function(myEvent, x) {
        if(myEvent.currentTarget.childNodes[0].nodeName === "SPAN") {
            //already liked, now cancel it
            myEvent.currentTarget.innerHTML = "<i class='fa fa-star-o' aria-hidden='true'></i>";

            var allData = JSON.parse(localStorage.coms);
            var i;
            for(i = 0; i < allData.length; i++) {
                if(allData[i].committee_id === x.committee_id) {
                    // catch the entry i
                    allData.splice(i, 1);
                    break;
                }
            }
            if(allData.length == 0) {
                localStorage.removeItem("coms");
                $scope.favComs = [];
            } else {
                localStorage.coms = JSON.stringify(allData);
                $scope.favComs = JSON.parse(localStorage.coms);
            }
        } else {
            // not liked, adding it
            myEvent.currentTarget.innerHTML = "<span class='fa-stack fa-lg'><i class='fa fa-star-o fa-stack-1x'></i><i class='fa fa-star fa-stack-1x' style='color:gold;'></i></span>";
            // collect data to string
            var stringData = {"chamber":x.chamber,
                              "committee_id":x.committee_id,
                              "name":x.name,
                              "parent_committee_id":x.parent_committee_id,
                              "subcommittee":x.subcommittee
                             };
            
            if(localStorage.coms == null){
                localStorage.coms = JSON.stringify([stringData]);
            } else {
                var allData = JSON.parse(localStorage.coms);
                allData.push(stringData);
                localStorage.coms = JSON.stringify(allData);
            }
            //update
            $scope.favComs = JSON.parse(localStorage.coms);

        }
        // update the committees section data sets
        for(i = 0; i < $scope.comHouseData.length; i++) {
            $scope.comHouseData[i].favorite = "0";
        }
        for(i = 0; i < $scope.comSenateData.length; i++) {
            $scope.comSenateData[i].favorite = "0";
        }
        for(i = 0; i < $scope.comJointData.length; i++) {
            $scope.comJointData[i].favorite = "0";
        }
        var i,j, hit;
        if(localStorage.coms != null) {
            var allData = JSON.parse(localStorage.coms);
            
            for(i = 0; i < allData.length; i++) {
                hit = 0;
                for(j = 0; j < $scope.comHouseData.length && !hit; j++) {
                    if(allData[i].committee_id === $scope.comHouseData[j].committee_id) {
                        // hit!
                        $scope.comHouseData[j].favorite = "1";
                        hit = 1;
                    }

                }
                for(j = 0; j < $scope.comSenateData.length && !hit; j++) {
                    if(allData[i].committee_id === $scope.comSenateData[j].committee_id) {
                        // hit!
                        $scope.comSenateData[j].favorite = "1";
                        hit = 1;
                    }
                }
                for(j = 0; j < $scope.comJointData.length && !hit; j++) {
                    if(allData[i].committee_id === $scope.comJointData[j].committee_id) {
                        // hit!
                        $scope.comJointData[j].favorite = "1";
                        hit = 1;
                    }
                }
            }
        }
    };
    
    /* Bill Detail Section */
    $scope.billDetail = function(x) {
        
        // detect if this one liked before
        
        $(".billFavButton").html("<i class='fa fa-star-o' aria-hidden='true'></i>");
        if(localStorage.bills != null) {
            var allData = JSON.parse(localStorage.bills);
            var i;
            for(i = 0; i < allData.length; i++) {
                if(allData[i].bill_id === x.bill_id) {
                    // hit!
                    $(".billFavButton").html("<span class='fa-stack fa-lg'><i class='fa fa-star-o fa-stack-1x'></i><i class='fa fa-star fa-stack-1x' style='color:gold;'></i></span>");
                    break;
                }
            }
        }
        
        $scope.billSponsorTitle = x.sponsor.title;
        $scope.billSponsorLast = x.sponsor.last_name;
        $scope.billSponsorFirst = x.sponsor.first_name;
        $scope.billHistoryActive = x.history.active;
        
        $scope.billIdDetail = x.bill_id;
        $scope.billTitleDetail = x.official_title;
        $scope.billTypeDetail = x.bill_type;
        $scope.billSponsorDetail = x.sponsor.title + ". " + x.sponsor.last_name + ", " + x.sponsor.first_name;
        $scope.billChamberDetail = x.chamber;
        $scope.billStatusDetail = x.history.active === true ? "Active" : "Inactive";
        $scope.billIntroduceDetail = x.introduced_on;
        $scope.billCongressDetail = x.urls.congress;
        $scope.billVersionDetail = x.last_version.version_name;
        $scope.billUrlDetail = x.last_version.urls.pdf;
    };
    
    /* favorite delete */
    $scope.deleteFavLeg = function(x) {
        var allData = JSON.parse(localStorage.legislators);
        var i;
        for(i = 0; i < allData.length; i++) {
            if(allData[i].bioguide_id === x.bioguide_id) {
                // catch the entry i
                allData.splice(i, 1);
                break;
            }
        }

        if(allData.length == 0) {
            localStorage.removeItem("legislators");
            $scope.favLegislators = [];
        } else {
            localStorage.legislators = JSON.stringify(allData);
            $scope.favLegislators = JSON.parse(localStorage.legislators);
        }
        // update the page
        $scope.favLegUpdate();
    };
    
    $scope.deleteFavBill = function(x) {
        var allData = JSON.parse(localStorage.bills);
        var i;
        for(i = 0; i < allData.length; i++) {
            if(allData[i].bill_id === x.bill_id) {
                // catch the entry i
                allData.splice(i, 1);
                break;
            }
        }
        if(allData.length == 0) {
            localStorage.removeItem("bills");
            $scope.favBills = [];
        } else {
            localStorage.bills = JSON.stringify(allData);
            $scope.favBills = JSON.parse(localStorage.bills);
        }
        // update the page
        $scope.favBillUpdate();
    };
    
    $scope.deleteFavCom = function(x) {
        var allData = JSON.parse(localStorage.coms);
        var i;
        for(i = 0; i < allData.length; i++) {
            if(allData[i].committee_id === x.committee_id) {
                // catch the entry i
                allData.splice(i, 1);
                break;
            }
        }
        if(allData.length == 0) {
            localStorage.removeItem("coms");
            $scope.favComs = [];
        } else {
            localStorage.coms = JSON.stringify(allData);
            $scope.favComs = JSON.parse(localStorage.coms);
        }
        // update the page
        $scope.favComUpdate();
        
        // update the favorite status
        for(i = 0; i < $scope.comHouseData.length; i++) {
            $scope.comHouseData[i].favorite = "0";
        }
        for(i = 0; i < $scope.comSenateData.length; i++) {
            $scope.comSenateData[i].favorite = "0";
        }
        for(i = 0; i < $scope.comJointData.length; i++) {
            $scope.comJointData[i].favorite = "0";
        }
        
        if(localStorage.coms != null) {
            allData = JSON.parse(localStorage.coms);
            var j, hit;
            for(i = 0; i < allData.length; i++) {
                hit = 0;
                for(j = 0; j < $scope.comHouseData.length && !hit; j++) {
                    if(allData[i].committee_id === $scope.comHouseData[j].committee_id) {
                        // hit!
                        $scope.comHouseData[j].favorite = "1";
                        hit = 1;
                    }
                }
                for(j = 0; j < $scope.comSenateData.length && !hit; j++) {
                    if(allData[i].committee_id === $scope.comSenateData[j].committee_id) {
                        // hit!
                        $scope.comSenateData[j].favorite = "1";
                        hit = 1;
                    }
                }
                for(j = 0; j < $scope.comJointData.length && !hit; j++) {
                    if(allData[i].committee_id === $scope.comJointData[j].committee_id) {
                        // hit!
                        $scope.comJointData[j].favorite = "1";
                        hit = 1;
                    }
                }
            }
        }
    };
    
    $scope.favLegUpdate = function() {
        if(localStorage.legislators != null){
            $scope.favLegislators = JSON.parse(localStorage.legislators);
            $("#fav4leg").html("<td class='col-xs-1'><button type='button' class='btn btn_default' style='background-color:white;' ng-click='deleteFavLeg(x)'><span class='glyphicon glyphicon-trash' aria-hidden='true'></span></button></td><td class='col-xs-1'><img ng-src='{{x.photo}}' style='height:40px; width:auto;' /></td><td class='col-xs-1' ng-if='x.party == \'R\''><img src='r.png' style='height:30px; width:auto;'/></td><td class='col-xs-1' ng-if='x.party == \'D\''><img src='d.png' style='height:30px; width:auto;'/></td><td class='col-xs-1'>{{x.last_name + ', ' + x.first_name}}</td><td class='col-xs-1' ng-if='x.chamber == \'house\''><img src='h.png' style='width: 20%; height: auto;'/>{{ ' ' + (x.chamber.charAt(0).toUpperCase() + x.chamber.substr(1).toLowerCase())}}</td><td class='col-xs-1' ng-if='x.chamber == \'senate\''><img src='s.svg' style='width: 19%; height: auto;'/>{{ ' ' + (x.chamber.charAt(0).toUpperCase() + x.chamber.substr(1).toLowerCase())}}</td><td class='col-xs-1'>{{x.state_name}}</td><td class='col-xs-1'><a href='{{\'mailto:\' + x.oc_email}}'>{{x.oc_email}}</a></td><td class='col-xs-1'><button type='button' href='#carousel-favorite' data-slide-to='1' class='right btn btn_default' style='background-color: #3C84BF; color: white;' ng-click='legislatorDetail(x)'>View Details</button></td>");
        } else {
            $("#fav4leg").html("");
        }
        
    };
    $scope.favBillUpdate = function() {
        
        if(localStorage.bills != null){
            $scope.favBills = JSON.parse(localStorage.bills);
            $("#fav4bill").html("<td class='col-xs-1'><button type='button' class='btn btn_default' style='background-color:white;' ng-click='deleteFavBill(x)'><span class='glyphicon glyphicon-trash' aria-hidden='true'></span></button></td><td class='col-xs-1'>{{x.bill_id | uppercase}}</td><td class='col-xs-1'>{{x.bill_type | uppercase}}</td><td class='col-xs-1'>{{x.official_title}}</td><td class='col-xs-1' ng-if='x.chamber == \'house\''><img src='h.png' style='width: 20%; height: auto;'/>{{ ' ' + (x.chamber.charAt(0).toUpperCase() + x.chamber.substr(1).toLowerCase())}}</td><td class='col-xs-1' ng-if='x.chamber == \'senate\''><img src='s.svg' style='width: 19%; height: auto;'/>{{ ' ' + (x.chamber.charAt(0).toUpperCase() + x.chamber.substr(1).toLowerCase())}}</td><td class='col-xs-1'>{{x.introduced_on}}</td><td class='col-xs-1'>{{x.sponsor.title + '. ' + x.sponsor.last_name + ', ' + x.sponsor.first_name}}</td><td class='col-xs-1'><button type='button' href='#carousel-favorite' data-slide-to='2' class='right btn btn_default' style='background-color: #3C84BF; color: white;' ng-click='billDetail(x)'>View Details</button></td>");
        } else {
            $("#fav4bill").html("");
        }
    };
    
    $scope.favComUpdate = function() {
        if(localStorage.coms != null){
            $scope.favComs = JSON.parse(localStorage.coms);
            $("#fav4com").html("<td class='col-xs-1'><button type='button' class='btn btn_default' style='background-color:white;' ng-click='deleteFavCom(x)'><span class='glyphicon glyphicon-trash' aria-hidden='true'></span></button></td><td class='col-xs-1' ng-if='x.chamber == \'house\''><img src='h.png' style='width: 20%; height: auto;'/>{{ ' ' + (x.chamber.charAt(0).toUpperCase() + x.chamber.substr(1).toLowerCase())}}</td><td class='col-xs-1' ng-if='x.chamber == \'senate\''><img src='s.svg' style='width: 19%; height: auto;'/>{{ ' ' + (x.chamber.charAt(0).toUpperCase() + x.chamber.substr(1).toLowerCase())}}</td><td class='col-xs-2'>{{x.committee_id}}</td><td class='col-xs-4>{{x.name}}</td><td class='col-xs-2'>{{x.parent_committee_id}}</td><td class='col-xs-2'>{{x.subcommittee}}</td>");
        } else {
            $("#fav4com").html("");
        }
    };

});

app.filter('capFirst', function () {
    "use strict";
    return function (x) {
        return x.charAt(0).toUpperCase() + x.substr(1).toLowerCase();
    };
});

