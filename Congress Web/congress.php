<?php
    $api_key = "5d5253e129954fdebf14ce14e21ceb7f";
    $chamber = isset($_GET['chamber']) ? $_GET['chamber'] : ""; // for legislator and committee use, can be state, house, senate, joint
    // for legislators
    $keyword = isset($_GET['keyword']) ? $_GET['keyword'] : "";
    $congress = isset($_GET['congress']) ? $_GET['congress'] : ""; // can be legislators, bills, committees
    $state = isset($_GET['state']) ? $_GET['state'] : ""; //the state names
    // for bills
    $bills_active = isset($_GET['bills_active']) ? $_GET['bills_active'] : ""; // can be true or false
    $bills_id = isset($_GET['bills_id']) ? $_GET['bills_id'] : ""; // the id of the bill
    // for committees
    $com_id = isset($_GET['com_id']) ? $_GET['com_id'] : "";
    $sponsor_id = isset($_GET['sponsor_id']) ? $_GET['sponsor_id'] : "";
    $member_ids = isset($_GET['member_ids']) ? $_GET['member_ids'] : "";
    $bills_active = strtolower($bills_active);
    $bills_id = strtolower($bills_id);
    $keyword = ucfirst(strtolower($value));

    $stateArray = array(
        "Alabama" => "AL", "Alaska" => "AK", "Arizona" => "AZ", "Arkansas" => "AR", "California" => "CA", "Colorado" => "CO", 
        "Connecticut" => "CT", "Delaware" => "DE", "District Of Columbia" => "DC", "Florida" => "FL", "Georgia" => "GA", 
        "Hawaii" => "HI", "Idaho" => "ID", "Illinois" => "IL", "Indiana" => "IN", "Iowa" => "IA", "Kansas" => "KS", 
        "Kentucky" => "KY", "Louisiana" => "LA", "Maine" => "ME", "Maryland" => "MD", "Massachusetts" => "MA", "Michigan" => "MI", 
        "Minnesota" => "MN", "Mississippi" => "MS", "Missouri" => "MO", "Montana" => "MT", "Nebraska" => "NE", "Nevada" => "NV", 
        "New hampshire" => "NH", "New jersey" => "NJ", "New mexico" => "NM", "New york" => "NY", "North carolina" => "NC", 
        "North dakota" => "ND", "Ohio" => "OH", "Oklahoma" => "OK", "Oregon" => "OR", "Pennsylvania" => "PA", "Rhode island" => "RI", 
        "South carolina" => "SC", "South dakota" => "SD", "Tennessee" => "TN", "Texas" => "TX", "Utah" => "UT", "Vermont" => "VT", 
        "Virginia" => "VA", "Washington" => "WA", "West virginia" => "WV", "Wisconsin" => "WI", "Wyoming" => "WY"
    );



    if($congress == "legislators"){
        //$url = "http://congress.api.sunlightfoundation.com/" . $congress . "?";
        $url = "http://104.198.0.197:8080/" . $congress . "?";
        if($chamber == "state"){
            //show by state
            if($state != ""){
                $url .= "&state=" . $stateArray[$state];
            }
        }
        else {
            $url .= "&chamber=" . $chamber;
            if($keyword != "" && array_key_exists($keyword, $stateArray)){
                //keyword is a state name
                $url .= "&state=" . $stateArray[$keyword];
            }
            else{
                $url .= "&query=" . strtolower($keyword);
            }
        }

        $url .= "&apikey=" . $api_key . "&per_page=all";

        $json = file_get_contents($url);

        echo $json;

    }

    else if($congress == "bills"){
        //$url = "http://congress.api.sunlightfoundation.com/" . $congress . "?&history.active=" . $bills_active;
        $url = "http://104.198.0.197:8080/" . $congress . "?";
        if($sponsor_id != ""){
            $url .= "apikey=" . $api_key . "&per_page=5" . "&sponsor_id=" . $sponsor_id;
        }
        else {
            $url .= "history.active=" . $bills_active;
            $url .= "&apikey=" . $api_key . "&per_page=50" . "&last_version.urls.pdf__exists=true";
        }
         
        $json = file_get_contents($url);

        echo $json;

    }

    else if($congress == "committees"){
        //$url = "http://congress.api.sunlightfoundation.com/" . $congress . "?";
        $url = "http://104.198.0.197:8080/" . $congress . "?";
        if($member_ids != ""){
            $url .= "apikey=" . $api_key . "&per_page=5" . "&member_ids=" . $member_ids;
        }
        else {
            $url .= "apikey=" . $api_key . "&per_page=all";
        }
        
        $json = file_get_contents($url);

        echo $json;
    }

// Php ends here, no closing end
