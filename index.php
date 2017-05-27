<?php
	function show_form()
	{
		?>
			<form id="hotkeyRegion">
				<input type="hidden" id="inputLength" name="length" value="1"/>
				<div class="w3-row">
					<div class="w3-col s12"> 
						<button class="w3-btn">Submit!</button>	
					</div>
				</div>			
				<div class="w3-row w3-dark-grey w3-center">
					<div class="w3-col m6 w3-hide-small">
						Key/String
					</div>
					<div class="w3-col m6 w3-hide-small">
						Action
					</div>
				</div>
			</form>
		<?php
	}

	function build_form($formData)
	{
		?>
			<form id="hotkeyRegion">
				<input type="hidden" id="inputLength" name="length" value="1"/>
				<div class="w3-row">
					<div class="w3-col s12"> 
						<button class="w3-btn">Submit!</button>	
					</div>
				</div>			
				<div class="w3-row w3-dark-grey w3-center">
					<div class="w3-col m6 w3-hide-small">
						Key/String
					</div>
					<div class="w3-col m6 w3-hide-small">
						Action
					</div>
					<?php
						build_rows($formData);
					?>
				</div>
			</form>
		<?php
	}

	function build_rows($hotkeys)
	{
		$num_keys = $hotkeys['length'];
		foreach(range(0,$num_keys - 1) as $i)
						{
							if($_GET["func$i"] == 'KEY')
							echo "<div class=\"w3-row\" id=\"shortcut$i\">
									<div class=\"w3-col m6 s12\">
											<div class=\"w3-row\">
												<div class=\"w3-col m4\">
													<label><input type=\"radio\" name=\"func{0}\" value=\"KEY\" onclick=\"setHotKey({0});\" checked/> Hotkey</label>
													<label><input type=\"radio\" name=\"func{0}\" value=\"STRING\" onclick=\"setHotString({0});\"> Hotstring</input></label>
													|
												</div>
												<div class=\"w3-col m8 w3-right\">
													<div id=\"optionsShortcut{0}\" class=\"w3-row\">
														";
						
							$checked = (in_array("CTRL",$hotkeys["skey$i"])? "checked": "");
							echo "<div class=\"w3-col s3\"><label><input type=\"checkbox\" name=\"skey{0}[]\" value=\"CTRL\" $checked/>Control</label></div>";											
							
							$checked = (in_array("ALT",$hotkeys["skey$i"])? "checked": "");	
							echo "<div class=\"w3-col s3\"><label><input type=\"checkbox\" name=\"skey{0}[]\" value=\"ALT\" $checked/>Alt</label></div>";
							
							$checked = (in_array("SHIFT",$hotkeys["skey$i"])? "SHIFT": "");
							echo "<div class=\"w3-col s3\"><label><input type=\"checkbox\" name=\"skey{0}[]\" value=\"SHIFT\"/>Shift</label></div>";

							$value = (in_array("skeyValue$i", $hotkeys)? $hotkeys["skeyValue$i"]: "");
							echo "<div class=\"w3-col s3\"><input type=\"text\" placeholder=\"key\" name=\"skeyValue{0}\" style=\"width:5em;\" maxlength=\"1\" required value=\"$value\"/></div>";

							echo "</div></div></div></div>";

							$this_function = "(Select a function)";

							echo "<pre>";

							print_r($hotkeys);

							echo "</pre>";

							switch($hotkeys["option$i"])
							{
								case 'ActivateOrOpen':
									$window = ""; //$hotkeys["window$i"];
									$program = ""; //$hotkeys["program$i"];
									$this_function = "ActivateOrOpen(<input type=\"text\" name=\"Window$i\" id=\"window$i\" placeholder=\"Window\" style=\"width:10em\" required/>,<input id=\"program$i\" type=\"text\" name=\"Program$i\" placeholder=\"Program\" style=\"width:10em\" value=\"$program\" required/>)<input type=\"hidden\" value=\"ActivateOrOpen\" name=\"option$i\" id=\"option$i\"/>";
										break;
								case 'Send':
									$this_function = 'send, ' . $_GET["input$i"]; break;
								case 'Replace':
									$this_function = $_GET["input$i"]; break;
							}

							echo "<div class=\"w3-col m6 s12\">
								<div class=\"w3-row-padding\">
									<div style=\"cursor:default\" class=\"w3-col s10 w3-dropdown-click\">
										<div class=\"w3-btn\" onclick=\"dropdown(\\'{0}\\')\"><span id=\"function{0}\" >(Select a function)</span><i id=\"arrow{0}\" class=\"fa fa-caret-right\" aria-hidden=\"true\"></i></div>
										<div id=\"key{0}\" class=\"w3-dropdown-content w3-border ontop\">
												<button type=\"button\" class=\"w3-btn w3-margin\" onclick=\"select(\\'ActivateOrOpen\\', \\'{0}\\')\">ActivateOrOpen(\"Window\",\"Program\")</button>
												<br/>
												<button type=\"button\" class=\"w3-btn w3-margin\" onclick=\"select(\\'Send\\', \\'{0}\\')\">Send(\"input\")</button>
												<br/>
												<button type=\"button\" class=\"w3-btn w3-margin\" onclick=\"select(\\'Replace\\', \\'{0}\\')\">Replace(\"input\")</button>
											</div>
									</div>
									<div class=\"w3-col s2\">
										<button type=\"button\" onclick=\"remove(\\'{0}\\')\" class=\"w3-btn w3-margin\" id=\"dropdown{0}\"><i class=\"fa fa-times-circle-o\" title=\"Delete \\hotkey\"></i></button>
									</div>
								</div>
							</div>
						</div>";
					//$index += 1;
					//$count += 1;
						}
					//$('#inputLength').val(count);
				//$('#hotkeyRegion').append(newDiv)
	}
?>

<html>
	<head>
		<title>AHK Scrip Generator</title>
		
		<meta name="viewport" content="width=device-width, initial-scale=1">
		
		
		<!--<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />-->
		
		<script src="scripts/jquery.min.js"></script>
		
		<link rel="stylesheet" href="css/w3.css"/><!--http://www.w3schools.com/lib/w3.css -->
		<link rel="stylesheet" href="css/styles.css"/>
		<link rel="stylesheet" href="css/font-awesome-4.6.3/css/font-awesome.min.css"/>
		<link rel="stylesheet" href="css/font-awesome-animation.min.css"/>
		<script>
			$(window).load(ready);
			
			function ready()
			{
				newRow();
				$('#hotkeyRegion').submit(function() {
					result = true;
					for(var i=0; i < count; i++)
					{
						if($('#option' + i).length == 0 && $('#function' + i).length > 0) 
						{
							//it doesn't exist
							result = false;
							alert("Must select a function for all rows");
							break;
						}
					}
					return result; // return false to cancel form action
				});
			}

			function handleClick(ev) 
			{
				console.log('clicked on ' + this.tagName);
				ev.stopPropagation();
			}
		
			//from http://stackoverflow/a/20729945
			String.prototype.format = function()
			{
				var str = this;
				for (var i = 0; i < arguments.length; i++)
				{
					var reg = new RegExp("\\{" + i + "\\}", "gm");
					str = str.replace(reg, arguments[i]);
					return str;
				}
			}
		
			index = 0;
			count = 0;
			function dropdown(id) 
			{
				console.log('#key' + id);
				if($('#key' + id).hasClass("w3-show"))
				{
					console.log("Hide it");
					$(".w3-dropdown-content").removeClass("w3-show"); 
					$(".w3-dropdown-content").removeClass("ontop"); 
					$(".fa-caret-right").removeClass("fa-rotate-90"); 
				}
				else
				{
					console.log("show it");
					$(".w3-dropdown-content").removeClass("w3-show"); //hide all - make sure none of the others are open
					$(".fa-caret-right").removeClass("fa-rotate-90"); 
					$('#arrow' + id).addClass('fa-rotate-90');
					$('#key' + id).addClass('w3-show').addClass('ontop');
				}
			}

			function select(item, id)
			{
				$('.w3-dropdown-content').removeClass('w3-show');
				$(".fa-caret-right").removeClass("fa-rotate-90"); 
					
				if(item == 'ActivateOrOpen')
				{
					$('#function' + id).html('ActivateOrOpen(\
					<input type="text" name="Window{0}" id="window{0}" placeholder="Window" style="width:10em" required/>,\
					<input id="program{0}" type="text" name="Program{0}" placeholder="Program" style="width:10em" required/>)\
					<input type="hidden" value="ActivateOrOpen" name="option{0}" id="option{0}"/>'.format(id))

					$("#program" + id).click(function(event){
						event.stopPropagation();
					});
					$("#window" + id).click(function(event){
						event.stopPropagation();
					});
				}
				else if(item == 'Send')
				{
					$('#function' + id).html('Send(<input name="input{0}"  id="input{0}" type="text" placeholder="input" required/>)\
					<input type="hidden" value="Send" name="option{0}" id="option{0}"/>'.format(id))

					$("#input" + id).click(function(event){
						event.stopPropagation();
					});
				}
				else if(item == 'Replace')
				{
					$('#function' + id).html('Replace(<input type="text" name="input{0}" id="input{0}" placeholder="input" required/>)\
					<input type="hidden" value="Replace" name="option{0}" id="option{0}"/>'.format(id))
					$("#input" + id).click(function(event){
						event.stopPropagation();
					});
				}
			}

			function remove(id)
			{
				$('#shortcut' + id).remove() //delete row from table
				count -= 1;
				$('#inputLength').val(count);
			}

			function setHotKey(id)
			{
				$('#optionsShortcut' + id).html('<div class="w3-col s3">												 \
												<label><input type="checkbox" name="skey{0}[]" value="CTRL"/>Control</label>	 \
											</div>																 \
											<div class="w3-col s3">												 \
												<label><input type="checkbox" name="skey{0}[]" value="ALT"/>Alt</label>		 \
											</div>																 \
											<div class="w3-col s3">												 \
												<label><input type="checkbox" name="skey{0}[]" value="SHIFT"/>Shift</label>		 \
											</div>																 \
											<div class="w3-col s3">												 \
												<input type="text" placeholder="key" name="skeyValue{0}" style="width:5em;" maxlength="1" required/> \
											</div>'.format(id))
			}

			function setHotString(id)
			{
				$('#optionsShortcut' + id).html('<div class="w3-col s6">										 \
												<input type="text" placeholder="string" name="skeyValue{0}" required/> \
											</div>'.format(id))
			}

			function newRow()
			{
				newDiv = '<div class="w3-row" id="shortcut{0}">													 \
						<div class="w3-col m6 s12">																 \
								<div class="w3-row">															 \
									<div class="w3-col m4">														 \
										<label><input type="radio" name="func{0}" value="KEY" onclick="setHotKey({0});" checked/> Hotkey</label>	 \
										<label><input type="radio" name="func{0}" value="STRING" onclick="setHotString({0});"> Hotstring</input></label>	 \
										|																		\
									</div>																		 \
									<div class="w3-col m8 w3-right">											 \
										<div id="optionsShortcut{0}" class="w3-row">					         \
											<div class="w3-col s3">												 \
												<label><input type="checkbox" name="skey{0}[]" value="CTRL"/>Control</label>	 \
											</div>																 \
											<div class="w3-col s3">												 \
												<label><input type="checkbox" name="skey{0}[]" value="ALT"/>Alt</label>		 \
											</div>																 \
											<div class="w3-col s3">												 \
												<label><input type="checkbox" name="skey{0}[]" value="SHIFT"/>Shift</label>		 \
											</div>																 \
											<div class="w3-col s3">												 \
												<input type="text" placeholder="key" name="skeyValue{0}" style="width:5em;" maxlength="1" required/> \
											</div>																 \
										</div>																	 \
									</div>																		 \
								</div>																			 \
							</div>																				 \
						<div class="w3-col m6 s12">																 \
							<div class="w3-row-padding">														 \
								<div style="cursor:default" class="w3-col s10 w3-dropdown-click">				 \
									<div class="w3-btn" onclick="dropdown(\'{0}\')"><span id="function{0}" >(Select a function)</span><i id="arrow{0}" class="fa fa-caret-right" aria-hidden="true"></i></div>						 \
									<div id="key{0}" class="w3-dropdown-content w3-border ontop">				 \
											<button type="button" class="w3-btn w3-margin" onclick="select(\'ActivateOrOpen\', \'{0}\')">ActivateOrOpen("Window","Program")</button>\
											<br/>																 \
											<button type="button" class="w3-btn w3-margin" onclick="select(\'Send\', \'{0}\')">Send("input")</button>\
											<br/>																 \
											<button type="button" class="w3-btn w3-margin" onclick="select(\'Replace\', \'{0}\')">Replace("input")</button>\
										</div>																	 \
								</div>																			 \																			 \
								<div class="w3-col s2">															 \
									<button type="button" onclick="remove(\'{0}\')" class="w3-btn w3-margin" id="dropdown{0}"><i class="fa fa-times-circle-o" title="Delete \hotkey"></i></button>\
								</div>																			 \
							</div>  																			 \
						</div>																					 \
					</div>																						 \
					'.format(index);
					index += 1;
					count += 1;
					$('#inputLength').val(count);
				$('#hotkeyRegion').append(newDiv)
			}

		</script>
	</head>
	<body>
			
				<?php
					if(sizeof($_GET))
					{
						//echo "<pre>";
						//print_r($_GET);
						//echo "</pre>";
						
						$num_keys = $_GET['length'];
						//echo "Length: $num_keys<br/>";

						$filename = 'ahk/AutoHotkeys.ahk';
						$fileContents = "#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.
setTitleMatchMode, 2 ; set title match mode to 'contains'


";
						foreach(range(0,$num_keys - 1) as $i)
						{
							if($_GET["func$i"] == 'KEY')
							{
								//echo "Hotkey $i <br/>";
								$key = $_GET["skeyValue$i"];
								$modifiers = $_GET["skey$i"];
								$operator = "";
								foreach($modifiers as $modifier)
								{
									switch ($modifier) {
										case 'ALT': $operator .='!'; break;
										case 'CTRL': $operator .= '^'; break;
										case 'SHIFT': $operator .= '+'; break;
									}
								}
								$function = "return";
								switch ($_GET["option$i"])
								{
									case 'ActivateOrOpen':
										$function = 'ActivateOrOpen("' . $_GET["Window$i"] . '", "' . $_GET["Program$i"] . '")';
										break;
									case 'Send':
									case 'Replace':
										$function = 'send, ' . $_GET["input$i"]; break;
								}
								
								//echo "$operator" . "$key::$function";

								$fileContents .= "$operator" . "$key::$function\n";
								//echo "<br/>";
								//echo "<br/>";				
							}
							else
							{
								//echo "Hotstring $i <br/>";
								$key = $_GET["skeyValue$i"];
								
								$function = "return";
								switch ($_GET["option$i"])
								{
									case 'ActivateOrOpen':
										$function = 'ActivateOrOpen("' . $_GET["Window$i"] . '", ' . $_GET["Program$i"] . '")';
										break;
									case 'Send':
										$function = 'send, ' . $_GET["input$i"]; break;
									case 'Replace':
										$function = $_GET["input$i"]; break;
								}
								
								//echo ":*c:$key::$function";
								$fileContents .= ":*c:$key::$function\n";
								//echo "<br/>";
								//echo "<br/>";	
							}
						}
						$fileContents .= "

ActivateOrOpen(window, program)
{
	;MsgBox The value in the variable named Var is %window%.
	if WinExist(window)
	{
		WinActivate  ; Uses the last found window.
	}
	else
	{
		 Run %program%
		 IfWinNotActive, %window%, , WinActivate, %window%
		 {
			  WinActivate
		 }
	}
	return
}";
						file_put_contents($filename, $fileContents);		

						build_form($_GET);

					}
					else
					{
						show_form();
					}
				?>
				<div id="newRow" class="w3-row">
					<div class="w3-col s12 w3-center">
						<button class="w3-btn" onclick="newRow()"><i class="fa fa-plus" title="Delete hotkey"></i></button>
					</div>
				</div>
			</div>
	</body>
</html>