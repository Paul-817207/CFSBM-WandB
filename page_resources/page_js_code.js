//function to convert litres to usg and put litres value in usg field
function convert_litres(tank){
	
	//alert('in convert function'+tank);
	if(tank === 'main_usg'){
		if (!isNaN(parseFloat(document.getElementById("main_fuel_usg").value, 10))){
			document.getElementById("main_fuel_litres").value = parseFloat((parseFloat(document.getElementById("main_fuel_usg").value, 10)/0.26417).toFixed(1));
		}else{
			document.getElementById("main_fuel_litres").value = 0;
		}
	}
	if(tank === 'main_litres'){
		if (!isNaN(parseFloat(document.getElementById("main_fuel_litres").value, 10))){
			document.getElementById("main_fuel_usg").value = parseFloat((parseFloat(document.getElementById("main_fuel_litres").value, 10)*0.26417).toFixed(1));
		}else{
			document.getElementById("main_fuel_usg").value = 0;
		}
	}
	if(tank === 'wing_usg'){
		if (!isNaN(parseFloat(document.getElementById("wing_fuel_usg").value, 10))){
			document.getElementById("wing_fuel_litres").value = parseFloat((parseFloat(document.getElementById("wing_fuel_usg").value, 10)/0.26417).toFixed(1));
		}else{
			document.getElementById("wing_fuel_litres").value = 0;
		}
	}
	if(tank === 'wing_litres'){
		if (!isNaN(parseFloat(document.getElementById("wing_fuel_litres").value, 10))){
			document.getElementById("wing_fuel_usg").value = parseFloat((parseFloat(document.getElementById("wing_fuel_litres").value, 10)*0.26417).toFixed(1));
		}else{
			document.getElementById("wing_fuel_usg").value = 0;
		}
	}
	if(tank === 'est_fuel_usg'){
		if (!isNaN(parseFloat(document.getElementById("flight_fuel_used_usg").value, 10))){
			document.getElementById("estimated_fuel_litres").value = parseFloat((parseFloat(document.getElementById("flight_fuel_used_usg").value, 10)/0.26417).toFixed(1));
		}else{
			document.getElementById("estimated_fuel_litres").value = 0;
		}
	
	}
		if(tank === 'est_fuel_litres'){
		if (!isNaN(parseFloat(document.getElementById("estimated_fuel_litres").value, 10))){
			document.getElementById("flight_fuel_used_usg").value = parseFloat((parseFloat(document.getElementById("estimated_fuel_litres").value, 10)*0.26417).toFixed(1));
		}else{
			document.getElementById("flight_fuel_used_usg").value = 0;
		}
	}
	//After conversion is complete, call makeCalculation() to calculate and display the change
	makeCalculation();
}

function makeCalculation() { 
  // airplane weights listed here are based on the corrected values due to errors within the Weight and balance document Dated: Oct 4 2019
  const MAX_GROSS_WEIGHT = 1220;
  const WHEEL_BASIC_EMPTY_WEIGHT = 770;
  const SKI_BASIC_EMPTY_WEIGHT = 782;
  const AIRCRAFT_ARM_WHEELS = 13.75;//10.75;
  const AIRCRAFT_ARM_SKIS = 13.59;//10.63;
  const OIL_QUART_LBS = 1.875;
  const FUEL_USG_LBS = 6.0;
  const FUEL_BURN_USGPH = 4.9; //estimated US gallons per hour of fuel burn of this engine at cruise power setting
  const PILOT_ARM = 36.0;
  const PASS_ARM = 9.0;
  const BAGGAGE_ARM = 49.0;
  const FUEL_MAIN_ARM = (-18.0);
  const FUEL_WING_ARM = 24.0;
  const OIL_ARM = (-29.0);
  const ARM_MIN = 10.6;
  const ARM_MAX = 22.7;
  let is_over_Gross_TO_weight = false;
  let is_over_Gross_LDG_weight = false;
  let is_outside_TO_CG_envelope = false;
  let is_outside_LDG_CG_envelope = false;
  let is_below_minimum_fuel_reserve = false;
  let take_off_weight = 0;
  let landing_weight = 0;
  let temp_value = 0.0;
  let gear_type = "";
  let pilot_lbs = 0;
  let pass_lbs = 0;
  let baggage_lbs = 0;
  let main_fuel_lbs = 0;
  let wing_fuel_lbs = 0;
  let oil_lbs = 0;
  let fuel_used_for_flight_lbs = 0;
  let main_fuel_volume_usg = 0.0;
  let wing_fuel_volume_usg = 0.0;
  let landing_main_fuel_usg = 0.0;
  let landing_wing_fuel_usg = 0.0;
  let landing_fuel_reserve_minutes = 0;
  let fuel_for_flight_usg = 0.0;
  let take_off_moment = 0.0;
  let landing_moment = 0.0;
  let CG_takeoff = 0.0;
  let CG_landing = 0.0;
  
  
  //collect date entered into the form
  
  //check for selected gear type
  if (document.getElementById("skis").checked == true)
  {
     gear_type = "SKIS";
  }
  else
  {
     gear_type = "WHEELS";
  }
  
  //get pilot weight from the form
  temp_value = parseInt(document.getElementById("pilot_weight").value, 10);
  if (isNaN(temp_value) || temp_value<0) 
  {
     //alert invalid entry
	 temp_value = 0;
	 document.getElementById("pilot_lbs_error").innerHTML = " ERROR entering pilot weight. Valid entry must be a positive number ";
  }else{
    //valid number has been entered
    pilot_lbs = temp_value;
	document.getElementById("pilot_lbs_error").innerHTML = "";
  }
  
  //get passenger weight from the form
  temp_value = parseInt(document.getElementById("pass_weight").value, 10);
  if (isNaN(temp_value) || temp_value < 0) 
  {
     //alert invalid entry
     temp_value = 0;	 
	 document.getElementById("pass_lbs_error").innerHTML = " ERROR entering passenger weight. Valid entry must be a positive number ";
  }else{
    //valid number has been entered
    pass_lbs = temp_value;
	document.getElementById("pass_lbs_error").innerHTML = "";
  }
  
  //get the baggage weight from the form
  temp_value = parseInt(document.getElementById("baggage_weight").value, 10);
  if (isNaN(temp_value) || temp_value < 0 || temp_value > 20) 
  {
     //alert invalid entry
     temp_value = 0;	 
	 document.getElementById("baggage_lbs_error").innerHTML = " ERROR entering baggage weight. Valid entry must be a positive number 20lbs or less";
  }else{
    //valid number has been entered
    baggage_lbs = temp_value;
	document.getElementById("baggage_lbs_error").innerHTML = "";
  }
  
  //get fuel quantity from the main fuel tank input, verify valid, and calculate weight from the usg volume
  temp_value = parseFloat(document.getElementById("main_fuel_usg").value, 10);
  if (isNaN(temp_value) || temp_value < 0 || temp_value > 10) 
  {
     //alert invalid entry
     temp_value = 0;	 
	 document.getElementById("main_fuel_error").innerHTML = " ERROR entering Main fuel tank USG. Valid entry must be a positive number up to 10 USG";
  }else{
    //valid number has been entered
    main_fuel_volume_usg = temp_value;
	main_fuel_lbs = main_fuel_volume_usg * FUEL_USG_LBS;
	document.getElementById("main_fuel_error").innerHTML = "";
  }
  
  //get fuel quantity from the wing fuel tank input, verify valid, and calculate weight from the usg volume
  temp_value = parseFloat(document.getElementById("wing_fuel_usg").value, 10);
  if (isNaN(temp_value) || temp_value < 0 || temp_value > 8) 
  {
     //alert invalid entry
     temp_value = 0; 
	 document.getElementById("wing_fuel_error").innerHTML = " ERROR entering Wing fuel tank USG. Valid entry must be a positive number up to 8 USG";
  }else{
    //valid number has been entered
    wing_fuel_volume_usg = temp_value;
	wing_fuel_lbs = wing_fuel_volume_usg * FUEL_USG_LBS;
	document.getElementById("wing_fuel_error").innerHTML = "";
  }
  
  //get oil quantity in engine sump and calcuate weight (amount over or under 4 quarts) with min 2 quart and max 5 quart limits
  temp_value = parseFloat(document.getElementById("oil_quarts").value, 10);
  if (isNaN(temp_value) || temp_value < 2 || temp_value > 5) 
  {
     //alert invalid entry
     temp_value = 0;
	 document.getElementById("oil_error").innerHTML = " ERROR entering oil level in engine. Valid entry must be between 2 and 5 quarts";
  }else{
    //valid number has been entered
    oil_lbs = (temp_value - 4) * OIL_QUART_LBS; //1.875; //calculate the weight of engine oil above or below the basic empty wight value of 4 quarts (1.875lbs/qt)
	document.getElementById("oil_error").innerHTML = "";
  }

  //get the value input for the USgallons expected to be used for the flight
  temp_value = parseFloat(document.getElementById("flight_fuel_used_usg").value, 10);
  if (isNaN(temp_value) || temp_value < 0 || (temp_value > (main_fuel_volume_usg + wing_fuel_volume_usg)) ) //invalid if less than 0 fuel will be used or more than the total possible capacity of 18usg
  {
     //alert invalid entry
     temp_value = 0; 
	 document.getElementById("fuel_for_flight_error").innerHTML = " ERROR This value must be between 0 and the combined quantity of the Main and Wing tanks";
  }else{
    //valid number has been entered
	fuel_for_flight_usg = temp_value;
    fuel_used_for_flight_lbs = fuel_for_flight_usg * FUEL_USG_LBS;// calculate the weight of the estimated fuel used for flight 
	document.getElementById("fuel_for_flight_error").innerHTML = "";
  }
  
  //total up weights for take off weight
  if (gear_type === "WHEELS")
  {
    take_off_weight = WHEEL_BASIC_EMPTY_WEIGHT + pilot_lbs + pass_lbs + baggage_lbs + main_fuel_lbs + wing_fuel_lbs + oil_lbs;
	landing_weight = take_off_weight - fuel_used_for_flight_lbs;
  }else{//must be on skis if it is not on wheels
    take_off_weight = SKI_BASIC_EMPTY_WEIGHT + pilot_lbs + pass_lbs + baggage_lbs + main_fuel_lbs + wing_fuel_lbs + oil_lbs;
	landing_weight = take_off_weight - fuel_used_for_flight_lbs;
  }
  
  //calculate Centre of Gravity
  //first, total all of the weights to get take_off_weight
  //second, calculate the MOMENT from each individual weight ARM (weight x arm = moment)
  //third, calculate the sum of all of the individual MOMENTs
  //fouth, calculate the CofG (CofG = sum of all MOMENTs / sum of all weights
  
  //sum up moments for take off
  take_off_moment = landing_moment = 0;
  
  if (gear_type === "WHEELS")
  {
    take_off_moment += WHEEL_BASIC_EMPTY_WEIGHT * AIRCRAFT_ARM_WHEELS;
  }else{//then its skis
    take_off_moment += SKI_BASIC_EMPTY_WEIGHT * AIRCRAFT_ARM_SKIS;
  }
  
  if(pilot_lbs > 0)
    take_off_moment += pilot_lbs * PILOT_ARM;
  if(pass_lbs > 0)
    take_off_moment += pass_lbs * PASS_ARM;
  if(baggage_lbs > 0)
    take_off_moment += baggage_lbs * BAGGAGE_ARM;
  if(oil_lbs > 0 || oil_lbs < 0)
	take_off_moment += oil_lbs * OIL_ARM;

  //landing and take off moment calculation is the same to this point so make them equal
  landing_moment = take_off_moment;

  if(main_fuel_lbs > 0)
    //take off moment
    take_off_moment += main_fuel_lbs * FUEL_MAIN_ARM;
	//landing moment ( fuel minus fuel used for flight )
  if(wing_fuel_lbs > 0)
    take_off_moment += wing_fuel_lbs * FUEL_WING_ARM;
	//landing moment (fuel minus fuel used for flight)

  //calculate and estimate of landing configuration. it complicated by the choice the pilot makes
  //about how much fuel, if any, is used from the wing tank.
  //for the purpose of this calculation, it will be assumed that the fuel will be used from the wing 
  //tank and drained into the main tank before landing.
  
  //check if any fuel has been entered in the wing tank, if none, then skip to the next step
  if(wing_fuel_lbs > 0)
  {
	  //check if fuel estimated for flight is greater than the amount entered in the wing tank. if so, then the wing tank will be assumed to be empty at landing
	  if (fuel_for_flight_usg < wing_fuel_volume_usg)
	  {
		  landing_main_fuel_usg = main_fuel_volume_usg;
		  landing_wing_fuel_usg = wing_fuel_volume_usg - fuel_for_flight_usg;
		  landing_moment += (landing_wing_fuel_usg * FUEL_USG_LBS) * FUEL_WING_ARM;
		  landing_moment += main_fuel_lbs * FUEL_MAIN_ARM;
	  }else{//all used from the wing therefore check and calculate how much also used from the main tank
		  landing_wing_fuel_usg = 0;
		  landing_main_fuel_usg = (main_fuel_volume_usg - (fuel_for_flight_usg - wing_fuel_volume_usg));
		  landing_moment += landing_main_fuel_usg * FUEL_USG_LBS * FUEL_MAIN_ARM;
	  }
  }else{//no fuel in wing on take off therefore all fuel used will be from the main tank, calcuate the landing fuel weight CG
	  landing_main_fuel_usg = main_fuel_volume_usg - fuel_for_flight_usg;
	  landing_moment += (main_fuel_lbs - fuel_used_for_flight_lbs) * FUEL_MAIN_ARM;
  }  
	
  //calculate take off C of G

  //calculate the Centre of Gravity for take off from the above provided data
  CG_takeoff = take_off_moment / take_off_weight;
  //calculate the Centre of Gravity for landing from the above provided data
  CG_landing = landing_moment / landing_weight;
	
  //ok, now all of the calculations are made, it is time to test the results to see if they are in the 
  //flight envelope or not and VERY CLEARLY display the results to the user, both in text and 
  //image form. people like pictures
  
  //check if the gross weight or the CofG is out of the safe envelope and set a flag to highlight that fact in RED
  if ( take_off_weight > MAX_GROSS_WEIGHT ){
	  is_over_TO_Gross_weight = true;
  }else{
	  is_over_TO_Gross_weight = false;
  }
  
  if ( landing_weight > MAX_GROSS_WEIGHT ) {
	  is_over_Gross_LDG_weight = true;
  }else{
	  is_over_Gross_LDG_weight = false;
  }

   if ( CG_takeoff < 10.6 || CG_takeoff > 22.7 ){
	   is_outside_TO_CG_envelope = true;
   }else{
	   is_outside_TO_CG_envelope = false;
   }
   
   if ( CG_landing < 10.6 || CG_landing > 22.7 ){
	   is_outside_LDG_CG_envelope = true;
   }else{
	   is_outside_LDG_CG_envelope = false;
   }
  //check to see of there is enough of a fuel reserve. Approx 2.5usg for 30 minutes and set a flag if it is not.
  landing_fuel_reserve_minutes = (landing_main_fuel_usg + landing_wing_fuel_usg) * (60 / FUEL_BURN_USGPH);
  if(landing_fuel_reserve_minutes < 30){
	  is_below_minimum_fuel_reserve = true;
  }else{
	  is_below_minimum_fuel_reserve = false;
  } 
  
  
  //output the results to the screen
  if (true)//valid results on the entry form
  {
    document.getElementById("output").innerHTML =  
    "<p> The Cub is on : " + gear_type + "<br><br>"
	+ "Take off configuration:<br>"   
	+ "&nbsp&nbsp&nbspMain fuel tank contains&nbsp" + main_fuel_volume_usg + "&nbspusg that weighs&nbsp" + main_fuel_lbs.toFixed(2) + "&nbsplbs<br>"
	+ "&nbsp&nbsp&nbspWing fuel tank contains&nbsp" + wing_fuel_volume_usg + "&nbspusg that weighs&nbsp" + wing_fuel_lbs.toFixed(2) + "&nbsplbs<br>"
	+ "&nbsp&nbsp&nbspTake off weight (max =1220lbs) =&nbsp " + (take_off_weight).toFixed(0) + "&nbsplbs&nbsp" + (is_over_TO_Gross_weight ? '<font color="red"><span>is over max gross weight. WARNING</span></font><br>':'<font color="green"><span>&nbspis OK</span></font><br>')
	+ "&nbsp&nbsp&nbspTake off Centre of Gravity (min 10.6 max 22.7) =&nbsp" + CG_takeoff.toFixed(2) + (is_outside_TO_CG_envelope ? '<font color="red"><span>&nbspOutside of CG envelope. WARNING</span></font><br><br>' : '<font color="green"><span>&nbspis OK</span></font><br>')
	+ "&nbsp&nbsp&nbspRemaining Load to gross weight is " + (MAX_GROSS_WEIGHT - take_off_weight).toFixed(0) + "&nbsplbs<br><br>"
	
	+ "Estimated landing configuration:<br>"
	+ "&nbsp&nbsp&nbspReserve fuel time is about &nbsp" + landing_fuel_reserve_minutes.toFixed(1) + "&nbspminutes calculated at&nbsp" + FUEL_BURN_USGPH + "&nbspusgph&nbsp" + ( (is_below_minimum_fuel_reserve) ?  '<font color="red"><span>WARNING, less than 30 minutes of fuel remaining at landing</span></font><br>' : '<font color="green"><span>&nbspis OK</span></font><br>' )
	+ "&nbsp&nbsp&nbspFuel MAIN tank level at landing is &nbsp" + landing_main_fuel_usg + "&nbspusg that weighs &nbsp" + (landing_main_fuel_usg * FUEL_USG_LBS).toFixed(2) + "&nbsplbs<br>"
	+ "&nbsp&nbsp&nbspFuel WING tank level at landing is &nbsp" + landing_wing_fuel_usg + "&nbspusg that weighs &nbsp" + (landing_wing_fuel_usg * FUEL_USG_LBS).toFixed(2) + "&nbsplbs<br>"
	+ "&nbsp&nbsp&nbspLanding weight (max =1220lbs) =&nbsp" + (landing_weight).toFixed(0) + "&nbsplbs&nbsp" + (is_over_Gross_LDG_weight ? '<font color="red"><span>is over max gross weight. WARNING</span></font><br>':'<font color="green"><span>is OK<br></font>')
	+ "&nbsp&nbsp&nbspLanding Centre of Gravity (min 10.6 max 22.7) = &nbsp" + CG_landing.toFixed(2) + (is_outside_LDG_CG_envelope ? '<font color="red"><span>&nbspOutside of CG envelope. WARNING</span></font><br>':'<font color="green"><span>&nbspis OK</span></font><br>')
    
    + "</p>";
  }
  else//invalid information on entry form
  {
    document.getElementById("output").innerHTML = "INVALID form data, Please complete the form or correct any mistakes entered";
  }
  
  //send the data to the chart function to display in chart form
  chart_it(take_off_weight, CG_takeoff, landing_weight, CG_landing,(is_outside_TO_CG_envelope || is_outside_LDG_CG_envelope || is_over_Gross_LDG_weight || is_over_TO_Gross_weight), is_below_minimum_fuel_reserve, (gear_type === "WHEELS") );
  
}