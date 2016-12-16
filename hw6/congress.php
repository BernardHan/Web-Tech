<!DOCTYPE html>
<html>
<head>
    <title>Forecast</title>
    
    <style>
        form {
            border: 1px solid black;
            width:24%;
            margin: 0 auto;
            line-height: 25px;

            
        }
        #wrapper {
            text-align: center; 
        }
        

        
        .table{
            
            text-align: center;
            margin: 0 auto;
            width: 60%;
            
        }
        
        #detail{
            margin: 0 auto;
            text-align: left;
            width: 70%;
        }
        
        #detail td{
            width: 200px;
        }
        
        img{
            margin: 0 auto;
            display: block;
        }
        
        #content{
            margin: 0 auto;
        }

        #detailBill{
            margin: 0 auto;
            text-align: left;
            width: 70%;
    
        }
        
        #detailBill td{
            width: 200px;
        }
    </style>
    
    <script type="text/javascript">
    function changeKeyword(){
        var value = document.getElementById("congress").value;
        var key = document.getElementById("key");
        switch(value){
            case "Legislators":
                key.innerHTML = "State/Representative*";
                break;
            case "Committees":
                key.innerHTML = "Committee ID*";
                break;
            case "Bills":
                key.innerHTML = "Bill ID*";
                break;
            case "Amendments":
                key.innerHTML = "Amendment ID*";
                break;
            default:
                key.innerHTML = "Keyword*";
                break;
        }
    }
    
    function myClear(){
        document.getElementById("key").innerHTML = "Keyword*";
        window.location = "congress.php";
        //document.getElementById("information").reset();
        //document.getElementById("congress").value = "1";
        //document.getElementById("firstRadio").checked = true;
        //document.getElementById("textKey").value = "";
        
    }
    
    function checkEmpty(){
        var selection = document.getElementById("congress").value;
        var keyword = document.getElementById("textKey").value;
        if(selection == "1" && keyword == ""){
            alert("Please enter the following missing information: Congress Database, keyword");
        }
        else if(selection == "1"){
            alert("Please enter the following missing information: Congress Database");
        }
        else if(keyword == ""){
            alert("Please enter the following missing information: keyword");
            
        }
    }
        
    function detail(url_photo, title, name, term_end, website, office, facebook, twitter){
        
        var content = document.getElementById("content");
        title = title == "" ? "N/A" : title;
        term_end = term_end == "" ? "N/A" : term_end;
        office = office == "" ? "N/A" : office;
        
        var text;
        if(url_photo != "null"){
            text = "<img align='middle' src= '"+ url_photo +"' /> <br>";
        }
        text += "<table id='detail'>" +
                    "<tr><td>Full Name</td> <td>" + title + " " + name + "</td></tr>" +
                    "<tr><td>Term Ends on</td> <td>" + term_end + "</td></tr>";
        if(website == "null"){
            text += "<tr><td>Website</td> <td>N/A</td></tr>" +
                "<tr><td>Office</td><td>" + office + "</td></tr>";
        }
        else{
            text += "<tr><td>Website</td> <td><a href='" + website + "' target='_blank'>" + website + "</a></td></tr>" +
                "<tr><td>Office</td><td>" + office + "</td></tr>";
        }
                    
        if(facebook == 'null'){
            text += "<tr><td>Facebook</td><td>N/A</td></tr>";
        }
        else{
            text += "<tr><td>Facebook</td><td><a href='" + facebook + "' target='_blank'>" + name + "</a></td></tr>";
        }

        if(twitter == "null"){
            text += "<tr><td>Twitter</td><td>N/A</td></tr>";
        }
        else{
            text += "<tr><td>Twitter</td><td><a href='" + twitter + "' target='_blank'>" + name + "</a></td></tr>";
        }
        
        text += "</table>";
        
        content.innerHTML = text;   
        content.style.border = "1px solid black";
        content.style.width = "60%";
        return false;
    }
        
        
    function detailBill(bill_id, bill_title, sponsor, introduced_on, last_action, bill_url){
        
        var content = document.getElementById("content");
        bill_id = bill_id == "" ? "N/A" : bill_id;
        bill_title = bill_title == "" ? "N/A" : bill_title;
        sponsor = sponsor == "" ? "N/A" : sponsor;
        introduced_on = introduced_on == "" ? "N/A" : introduced_on;
        last_action = last_action == "" ? "N/A" : last_action;
        
        var text = "<table id='detailBill'>" +
                    "<tr><td>Bill ID</td> <td>" + bill_id + "</td></tr>" +
                    "<tr><td>Bill Title</td> <td>" + bill_title + "</td></tr>" +
                    "<tr><td>Sponsor</td> <td>" + sponsor + "</td></tr>" +
                    "<tr><td>Introduced On</td><td>" + introduced_on + "</td></tr>" +
                    "<tr><td>Last action with date</td> <td>" + last_action + "</td></tr>";
                 
        if(bill_url == ""){
            text += "<tr><td>Bill URL</td><td>N/A</td></tr>";
        }
        else{
            text += "<tr><td>Bill URL</td><td><a href='" + bill_url + "' target='_blank'>" + bill_title + "</a></td></tr>";
        }
        
        text += "</table>";
        
        content.innerHTML = text;   
        content.style.border = "1px solid black";
        content.style.width = "60%";
        
        return false;
    }
        
    </script>
    

    
</head>

<body>
    
    <div id="wrapper">
    <h1>Congress Information Search</h1>

    <form method="post" action="" id="information">
        Congress Database
        <select name="congress" id="congress" onchange="changeKeyword()">
            <option value="1" <?php echo isset($_POST['congress']) && $_POST['congress'] == '1' ? "selected=selected" : "" ?>>Select your option</option>
            <option <?php echo isset($_POST['congress']) && $_POST['congress'] == 'Legislators' ? "selected=selected" : "" ?>>Legislators</option>
            <option <?php echo isset($_POST['congress']) && $_POST['congress'] == 'Committees' ? "selected=selected" : "" ?>>Committees</option>
            <option <?php echo isset($_POST['congress']) && $_POST['congress'] == 'Bills' ? "selected=selected" : "" ?>>Bills</option>
            <option <?php echo isset($_POST['congress']) && $_POST['congress'] == 'Amendments' ? "selected=selected" : "" ?>>Amendments</option>
        </select>
        <br>
        Chamber
        <input type="radio" name="chamber" value="senate" id="firstRadio" checked <?php echo isset($_POST['chamber']) && $_POST["chamber"] == "senate" ? "checked" : "" ?>>Senate
        <input type="radio" name="chamber" value="house" <?php echo isset($_POST['chamber']) && $_POST["chamber"] == "house" ? "checked" : "" ?>>House <br>

        <span id="key"><?php 
            if(isset($_POST['congress'])){
            switch($_POST["congress"]){
                case "Legislators":
                    echo "State/Representative*";
                    break;
                case "Committees":
                    echo "Committee ID*";
                    break;
                case "Bills":
                    echo "Bill ID*";
                    break;
                case "Amendments":
                    echo "Amendment ID*";
                    break;
                default:
                    echo "Keyword*";
                    break;
            }
            }
            else{
                echo "Keyword*";
            }
                    
            
            ?></span>
        <input type="text" name="keyword" id="textKey" value="<?php 
                                                              echo isset($_POST['keyword']) ? $_POST['keyword'] : "";
                                                        
                                                              ?>"><br>

        
        
        <input type="submit" value="Search" name="submitButton" onclick="checkEmpty()">
        <input type="reset" value="Clear" onclick="myClear()">
        <br>
        
        <a href="http://sunlightfoundation.com/" target="_blank">Powered by Sunlight Foundation</a>
        </form>
        
    </div>
    
    <br>
    <br>
    
    <div id="content">
    <?php
        $api_key = "5d5253e129954fdebf14ce14e21ceb7f";
        $chamber = "";
        $keyword = "";
        $congress = "";
        if(isset($_POST['submitButton']))
        {
            foreach($_POST as $key => $value){
                if($key == "congress"){
                    $congress = strtolower($value);
                }
                else if($key == "chamber"){
                    $chamber = strtolower($value);
                }
                else if($key == "keyword"){
                    $keyword = ucfirst(strtolower($value));
                }
            }
        }
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
        
        
        
        if($congress == "legislators" && $keyword != ""){
            $url = "http://congress.api.sunlightfoundation.com/" . $congress . "?" . "chamber=" . $chamber;
            if(array_key_exists($keyword, $stateArray)){
                //keyword is a state name
                $url .= "&state=" . $stateArray[$keyword];
            }
            else{
                $url .= "&query=" . strtolower($keyword);
            }
        
            $url .= "&apikey=" . $api_key;

            if(isset($_POST["submitButton"])){
                $json = file_get_contents($url);
                $information = json_decode($json, true);

                if(sizeof($information['results']) == 0){
                    echo "The API returned zero results for the request.";
                }
                else {
                    $htmlText = "<table class='table' border='1'> <tr> <th> Name </th> <th> State </th> <th> Chamber </th> <th> Details </th> </tr>";
                    foreach($information['results'] as $person){
                        if(array_key_exists('first_name', $person)){
                            $name = $person['first_name'] . " " . $person['last_name'];}
                        else{
                            $name = "N/A";
                        }
                        if(array_key_exists('state_name', $person)){
                            $state_name = $person['state_name'];}
                        else{
                            $state_name = "N/A";
                        }
                        if(array_key_exists('chamber', $person)){
                            $chamber_in_list = $person['chamber'];
                        }
                        else{
                            $chamber_in_list = "N/A";
                        }
                        if(array_key_exists('bioguide_id', $person)){
                            $id = $person['bioguide_id'];
                            $url_photo = "https://theunitedstates.io/images/congress/225x275/" . $id . ".jpg";
                        }
                        else{
                            $id = "N/A";
                            $url_photo = "null";
                        }

                        if(array_key_exists('title', $person)){
                             $title = $person['title'];
                        }
                        else{
                            $title = "";
                        }
                        if(array_key_exists('term_end', $person)){
                            $term_end = $person['term_end'];
                        }
                        else{
                            $term_end = "N/A";
                        }
                        if(array_key_exists('website', $person)){
                            $website = $person['website'] == "" ? "null" : $person['website'];
                        }
                        else{
                            $website = "null";
                        }
                        if(array_key_exists('office', $person)){
                            $office = $person['office'];
                        }
                        else{
                            $office = "N/A";
                        }
                        if(array_key_exists('facebook_id', $person)){
                            $facebook = $person['facebook_id'] == "" ? "null" : "https://www.facebook.com/" . $person['facebook_id'];
                        }
                        else{
                            $facebook = "null";
                        }
                        if(array_key_exists('twitter_id', $person)){
                            $twitter = $person['twitter_id'] == "" ? "null" : "https://twitter.com/" . $person['twitter_id'];
                        }
                        else{
                            $twitter = "null";
                        }

                        $htmlText .= "<tr> <td>" . $name . "</td> <td> " . $state_name . "</td> <td>" . $chamber_in_list . '</td>
                                    <td> <a href="#" onclick="return detail(\'' . $url_photo . '\','
                                                                            .'\''.$title .'\','
                                                                           .'\''. $name . '\','    
                                                                            .'\''. $term_end . '\','
                                                                            .'\''. $website . '\','
                                                                            .'\''. $office . '\','
                                                                            .'\''. $facebook . '\','
                                                                            .'\''. $twitter . '\'' .');">View Details </a></td></tr>';
                    }
                    $htmlText .= "</table>";
                    echo $htmlText;

                }
            }
        }
        
        else if($congress == "committees" && $keyword != ""){
            $url = "http://congress.api.sunlightfoundation.com/" . $congress . "?" . "committee_id=" . strtoupper($keyword) . "&chamber=" . $chamber . "&apikey=" . $api_key;
            if(isset($_POST["submitButton"])){
                $json = file_get_contents($url);
                $information = json_decode($json, true);

                if(sizeof($information['results']) == 0){
                    echo "The API returned zero results for the request.";
                }
                else{
                    $htmlText = "<table class='table' border='1'> <tr> <th> Committee ID </th> <th> Committee Name </th> <th> Chamber </th></tr>";
                    
                    foreach($information['results'] as $item){
                        $id = $item['committee_id'];
                        $name = $item['name'];
                        $chamber_in_list = $item['chamber'];
                        
                        $htmlText .= "<tr><td>" . $id . "</td><td>" . $name . "</td><td>" . $chamber_in_list . "</td></tr>";
                    }
                    $htmlText .= "</table>";
                    echo $htmlText;

                }
            }
        }
        else if($congress == "bills"&& $keyword != ""){
            $url = "http://congress.api.sunlightfoundation.com/" . $congress . "?" . "bill_id=" . strtolower($keyword) . "&chamber=" . $chamber . "&apikey=" . $api_key;
            if(isset($_POST["submitButton"])){
                $json = file_get_contents($url);
                $information = json_decode($json, true);

                if(sizeof($information['results']) == 0){
                    echo "The API returned zero results for the request.";
                }
                else{
                    $htmlText = "<table class='table' border='1'> <tr> <th> Bill ID </th> <th> Short Title </th> <th> Chamber </th><th>Details</th></tr>";
                    
                    foreach($information['results'] as $item){
                        $id = $item['bill_id'];
                        $short_title = $item['short_title'];
                        $chamber_in_list = $item['chamber'];
                        
                        $sponsor = $item['sponsor']['title'] . " " . $item['sponsor']['first_name'] . " " . $item['sponsor']['last_name'];
                        $introduced_on = $item['introduced_on'];
                        $last_action = $item['last_version']['version_name'] . ", " . $item['last_action_at'];
                        $bill_url = $item['last_version']['urls']['pdf'];
                        
                        $htmlText .= "<tr><td>" . $id . "</td><td>" . $short_title . "</td><td>" . $chamber_in_list . '</td>
                                    <td> <a href="#" onclick="return detailBill(\'' . $id . '\','
                                                                                .'\''. $short_title .'\','
                                                                                .'\''. $sponsor . '\','    
                                                                                .'\''. $introduced_on . '\','
                                                                                .'\''. $last_action . '\',' 
                                                                                .'\''. $bill_url . '\'' .');">View Details </a></td></tr>';
                    }
                    $htmlText .= "</table>";
                    echo $htmlText;

                }
            }
        }
        else if($congress == "amendments" && $keyword != ""){
            $url = "http://congress.api.sunlightfoundation.com/" . $congress . "?" . "amendment_id=" . strtolower($keyword) . "&chamber=" . $chamber . "&apikey=" . $api_key;
            if(isset($_POST["submitButton"])){
                $json = file_get_contents($url);
                $information = json_decode($json, true);

                if(sizeof($information['results']) == 0){
                    echo "The API returned zero results for the request.";
                }
                else{
                    $htmlText = "<table class='table' border='1'> <tr> <th> Amendment ID </th> <th> Amendment Type </th> <th> Chamber </th><th>Introduced on</th></tr>";
                    foreach($information['results'] as $item){
                        $id = $item['amendment_id'];
                        $type = $item['amendment_type'];
                        $chamber_in_list = $item['chamber'];
                        $introduced_on = $item['introduced_on'];
                        
                        $htmlText .= "<tr><td>" . $id . "</td><td>" . $type . "</td><td>" . $chamber_in_list . "</td><td>" . $introduced_on . "</td></tr>";
                    }
                    $htmlText .= "</table>";
                    echo $htmlText;
                }
            }
        }
    ?>
    
    </div>
    </body>



</html>