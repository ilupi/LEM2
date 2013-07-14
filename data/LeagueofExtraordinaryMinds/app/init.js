// Configuration
const BASEURL="";     // Fellövök neked egy tesztszervert, ha odajutsz, hogy kell. Ide annak a címe kell majd.
//const BASEURL="http://192.168.1.42:81/LEM_Server/";
const NETWORK={ DOWNLOADSUMMARYURL:     BASEURL + "DeveloperGenerated/forPlayers/DownloadSummary.php"};
const CLIENT={  HARDWAREMANUFACTURER:	"Samsung",
				SOFTWAREPLATFORM:		"SamsungSmartTV",
				SOFTWARETYPE:			"Free",
				SOFTWAREVERSION:		"1.444"};
const KEY={		UP:						$.sfKey.UP,
				DOWN:					$.sfKey.DOWN,
				LEFT:					$.sfKey.LEFT,
				RIGHT:					$.sfKey.RIGHT,
				ENTER:					$.sfKey.ENTER,
				HELP:					$.sfKey.STOP,
				RED:					$.sfKey.RED,
				GREEN:					$.sfKey.GREEN,
				YELLOW:					$.sfKey.YELLOW,
				BLUE:					$.sfKey.BLUE,
				// Samsung-specific keys
				VOLUMEUP:				$.sfKey.VOL_UP,
				VOLUMEDOWN:				$.sfKey.VOL_DOWN,
				VOLUMEMUTE:				$.sfKey.MUTE,
				RETURN:					$.sfKey.RETURN,
				EXIT:					$.sfKey.EXIT};
const TIMER={   DOWNLOADSUMMARYTIMEOUTEVENT:				1,
				UPLOADSTAKETIMEOUTEVENT:					2,
				NETWORKTIMEOUT:								10000,			// msec				
				MAINSCREENCURTAINDISAPPEAREDEVENT:			3,
				MAINSCREENCURTAINDISAPPEARINGTIMEINTERVAL:	2000,
				MAPREFRESHEVENT:							4,
				MAPREFRESHTIMEINTERVAL:						1000,
				ADREFRESHEVENT:								5,
				ADREFRESHTIMEINTERVAL:						30000,
				REMAININGTIMEEVENT:							6,
				REMAININGTIMEINTERVAL:						3000,
				SCREENSAVERSTOPTIMEEVENT:					7,
				SCREENSAVERSTOPTIMEINTERVAL:				2000};

// Detect system language. Samsung-specific workaround as
// 1) some TV models (e.g. Polish QA TV set) don't execute the lang/xxx.js file at all so the program can't use SYSTEMLANGUAGE, etc.
// 2) more TV models (inc. our one) + simulator don't handle non-ISO-639-1 language codes (eg. en-GB, zh-CN) provided by the TV
var LanguageCode="";
var EnvironmentElements = window.location.search.split('&');
for(var i=0; i < EnvironmentElements.length; i++)
{
	var EnvironmentElementParts = EnvironmentElements[i].split('=');
	if (EnvironmentElementParts[0]=="lang" || EnvironmentElementParts[0]=="?lang")
		LanguageCode=EnvironmentElementParts[1];
}
switch (LanguageCode)
{
	case "hu":
		var Settings={"SYSTEMLANGUAGE":"hu","LOCALIZEDTEXTDIRECTORY":"images/hu/","LOCALIZEDRANKDIGITGROUPLEFT":861,"LOCALIZEDTIMEDIGITGROUPLEFT":39};
		break;
	case "es":		// Intentional
	case "es-US":
		var Settings={"SYSTEMLANGUAGE":"es","LOCALIZEDTEXTDIRECTORY":"images/es/","LOCALIZEDRANKDIGITGROUPLEFT":786,"LOCALIZEDTIMEDIGITGROUPLEFT":97};
		break;
	case "ja":
		var Settings={"SYSTEMLANGUAGE":"ja","LOCALIZEDTEXTDIRECTORY":"images/ja/","LOCALIZEDRANKDIGITGROUPLEFT":767,"LOCALIZEDTIMEDIGITGROUPLEFT":65};
		break;
	case "ja":
		var Settings={"SYSTEMLANGUAGE":"ja","LOCALIZEDTEXTDIRECTORY":"images/ja/","LOCALIZEDRANKDIGITGROUPLEFT":767,"LOCALIZEDTIMEDIGITGROUPLEFT":65};
		break;
	case "ko":
		var Settings={"SYSTEMLANGUAGE":"ko","LOCALIZEDTEXTDIRECTORY":"images/ko/","LOCALIZEDRANKDIGITGROUPLEFT":735,"LOCALIZEDTIMEDIGITGROUPLEFT":120};
		break;	
	case "zh":		// Intentional
	case "zh-CN":
		var Settings={"SYSTEMLANGUAGE":"zh","LOCALIZEDTEXTDIRECTORY":"images/zh/","LOCALIZEDRANKDIGITGROUPLEFT":773,"LOCALIZEDTIMEDIGITGROUPLEFT":121};
		break;
	default:		// All others (including EN, EN-GB, etc)
		var Settings={"SYSTEMLANGUAGE":"en","LOCALIZEDTEXTDIRECTORY":"images/en/","LOCALIZEDRANKDIGITGROUPLEFT":799,"LOCALIZEDTIMEDIGITGROUPLEFT":34};
}
const SYSTEMLANGUAGE=Settings.SYSTEMLANGUAGE;
const LOCALIZEDTEXTDIRECTORY=Settings.LOCALIZEDTEXTDIRECTORY;
const LOCALIZEDRANKDIGITGROUPLEFT=Settings.LOCALIZEDRANKDIGITGROUPLEFT;
const LOCALIZEDTIMEDIGITGROUPLEFT=Settings.LOCALIZEDTIMEDIGITGROUPLEFT;
	
// Application-level objects
var WidgetAPIObj=new Common.API.Widget();
var PluginAPIObj=new Common.API.Plugin();
var SettingsObj=new SamsungSmartTVSettings(); 
var NetworkObj=new SamsungSmartTVNetwork();
var SoundPlayerObj=new SamsungSmartTVSoundPlayer();
var TimerObj=new SamsungSmartTVTimer();
var AccountObj=new Account();
var GameEngineObj=new GameEngine(); 

function onStart () 
{
	GameEngineObj.Init();       // It cannot be called earlier because e.g. Loading scene is not loaded yet 
};

function onDestroy () 
{
	SoundPlayerObj.Stop();
	NetworkObj.Destroy();
}

function GameEngine()
{
	const GAMESTATE={	WFSUMMARYDATA: 						0,
						WFLOADINGSCREENBLOCKERACCEPTANCE: 	1,
						WFLOADINGSCREENINFOACCEPTANCE: 		2,
						WFMAINSCREENCURTAINDISAPPEARING: 	3,
						WFFIRTSTIMEMESSAGEACCEPTANCE: 		4,
						WFWELCOMEMESSAGEACCEPTANCE: 		5,
						WFHALLOFFAMESELECTION: 				6,
						WFHALLOFFAMEACCEPTANCE: 			7,
						WFSENDSELECTION: 					8, 
						WFSENDCOMPLETION: 					9,
						WFSENDCOMPLETIONACCEPTANCE: 		10,
						WFSENDWARNINGACCEPTANCE: 			11,
						OPTION4STAKEDIGIT1: 				12, 
						OPTION4STAKEDIGIT2: 				13, 
						OPTION3STAKEDIGIT1: 				14, 
						OPTION3STAKEDIGIT2: 				15, 
						OPTION2STAKEDIGIT1: 				16, 
						OPTION2STAKEDIGIT2: 				17, 
						OPTION1STAKEDIGIT1: 				18, 
						OPTION1STAKEDIGIT2: 				19,
						WFBETHISTORYSELECTION: 				20, 
						WFBETHISTORYACCEPTANCE: 			21,
						WFHELPACCEPTANCE1: 					22,
						WFHELPACCEPTANCE2: 					23,
						WFHELPACCEPTANCE3: 					24,
						WFHELPACCEPTANCE4: 					25,
						WFHELPACCEPTANCE5: 					26,
						WFHELPACCEPTANCE6: 					27,
						// Samsunng-specific states
						WFEXITACCEPTANCE: 					100,
						WFHALLOFFAMEEXITACCEPTANCE: 		101,
						WFBETHISTORYEXITACCEPTANCE: 		102,
						WFRETURNACCEPTANCE:					103};
    var	GameState=null;

	this.Init=function()
	{
		var NNaviPlugin = document.getElementById('pluginObjectNNavi');		// Samsung bug: Screensaver API function needs this name (hardcoded into the framework)
		var NetworkPlugin = document.getElementById('pluginNetwork');
		var HardwareType = NNaviPlugin.GetModelCode();
		var DeviceID = NNaviPlugin.GetDUID(NetworkPlugin.GetMAC());

		NetworkObj.StartCommunicationWithServer(	NETWORK.DOWNLOADSUMMARYURL, 
													"PUT", 
													NetworkObj.ConvertToXML({   HardwareManufacturer:	CLIENT.HARDWAREMANUFACTURER,
																				HardwareType: 			HardwareType,
																				HardwareDeviceID: 		DeviceID,
																				SoftwarePlatform: 		CLIENT.SOFTWAREPLATFORM, 
																				SoftwareType: 			CLIENT.SOFTWARETYPE,
																				SoftwareVersion: 		CLIENT.SOFTWAREVERSION,
																				Language: 				SettingsObj.GetLanguage()}));
		TimerObj.Start(TIMER.DOWNLOADSUMMARYTIMEOUTEVENT,TIMER.NETWORKTIMEOUT);
		TimerObj.Start(TIMER.SCREENSAVERSTOPTIMEEVENT,TIMER.SCREENSAVERSTOPTIMEINTERVAL);
		$.sfScene.show('Loading');
		$.sfScene.focus('Loading');
		WidgetAPIObj.sendReadyEvent(); 
		this.GameState=GAMESTATE.WFSUMMARYDATA;
	};
	
	this.KeyEventHandler=function(keyCode)
    {
		// Repetitive event handler codes
		// Decrease code size & increase maintainability
		switch(keyCode)		// In all gamestates
		{
			case KEY.VOLUMEUP:
				SoundPlayerObj.VolumeUp();
				break;
			case KEY.VOLUMEDOWN:
				SoundPlayerObj.VolumeDown();
				break;
			case KEY.VOLUMEMUTE:
				SoundPlayerObj.VolumeMute();
				break;
		}

		if ([GAMESTATE.WFWELCOMEMESSAGEACCEPTANCE,GAMESTATE.WFHALLOFFAMESELECTION,GAMESTATE.WFSENDSELECTION,
			 GAMESTATE.WFSENDCOMPLETION,GAMESTATE.WFSENDCOMPLETIONACCEPTANCE,GAMESTATE.WFSENDWARNINGACCEPTANCE, 
			 GAMESTATE.OPTION4STAKEDIGIT1,GAMESTATE.OPTION4STAKEDIGIT2,GAMESTATE.OPTION3STAKEDIGIT1,
			 GAMESTATE.OPTION3STAKEDIGIT2,GAMESTATE.OPTION2STAKEDIGIT1,GAMESTATE.OPTION2STAKEDIGIT2,GAMESTATE.OPTION1STAKEDIGIT1,
			 GAMESTATE.OPTION1STAKEDIGIT2,GAMESTATE.WFBETHISTORYSELECTION,GAMESTATE.WFHELPACCEPTANCE1,
			 GAMESTATE.WFHELPACCEPTANCE2,GAMESTATE.WFHELPACCEPTANCE3,GAMESTATE.WFHELPACCEPTANCE4,
			 GAMESTATE.WFHELPACCEPTANCE5,GAMESTATE.WFHELPACCEPTANCE6].indexOf(this.GameState)!=-1 && keyCode==KEY.EXIT)
		{
			WidgetAPIObj.blockNavigation(event);
			DisplayPopup("ExitPopup");
			this.GameState=GAMESTATE.WFEXITACCEPTANCE;
			return;
		}

		if ([GAMESTATE.WFHALLOFFAMESELECTION,GAMESTATE.WFSENDSELECTION,GAMESTATE.OPTION4STAKEDIGIT1,
			 GAMESTATE.OPTION4STAKEDIGIT2,GAMESTATE.OPTION3STAKEDIGIT1,GAMESTATE.OPTION3STAKEDIGIT2,
			 GAMESTATE.OPTION2STAKEDIGIT1,GAMESTATE.OPTION2STAKEDIGIT2,GAMESTATE.OPTION1STAKEDIGIT1,
			 GAMESTATE.OPTION1STAKEDIGIT2,GAMESTATE.WFBETHISTORYSELECTION].indexOf(this.GameState)!=-1)
		{
			switch(keyCode)
			{
				case KEY.RED:
					DisplayHighlight("Option1StakeHighlight1");
					this.GameState=GAMESTATE.OPTION1STAKEDIGIT1;
					break;
				case KEY.GREEN:
					DisplayHighlight("Option2StakeHighlight1");
					this.GameState=GAMESTATE.OPTION2STAKEDIGIT1;
					break;
				case KEY.YELLOW:
					DisplayHighlight("Option3StakeHighlight1");
					this.GameState=GAMESTATE.OPTION3STAKEDIGIT1;
					break;
				case KEY.BLUE:
					DisplayHighlight("Option4StakeHighlight1");
					this.GameState=GAMESTATE.OPTION4STAKEDIGIT1;
					break;
				case KEY.HELP:
					TimerObj.Stop(TIMER.ADREFRESHEVENT);
					// Samsung specific solution: preload next help screen for faster rendering
					ImagePreLoading=new Image();
					ImagePreLoading.src=SettingsObj.GetLocalizedImagePath("HelpPopup2_960.png");	// HelpPopup1_960 is preloaded earlier
					DisplayPopup("HelpPopup1");
					this.GameState=GAMESTATE.WFHELPACCEPTANCE1;
					break;			
				case KEY.RETURN:		// Samsung-specific
					WidgetAPIObj.blockNavigation(event);
					DisplayPopup("ExitPopup");
					this.GameState=GAMESTATE.WFRETURNACCEPTANCE;
					return;				//  To prevent running of WFRETURNACCEPTANCE's handler (& closing the popup) immediately
			}
		}

		switch (this.GameState)	
		{
			case GAMESTATE.WFLOADINGSCREENBLOCKERACCEPTANCE:
				WidgetAPIObj.sendExitEvent(); 					// Return to TV screen
				break;
			case GAMESTATE.WFLOADINGSCREENINFOACCEPTANCE:
				$.sfScene.hide('Loading');
				$.sfScene.show('Main');
				if (NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > Account > IsNewAccount")=="TRUE")
					DisplayPopup("FirstTimePopup");
				else
				{
					if (NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > Account > IsNotificationNeededAboutReset")=="TRUE")
						DisplayPopup("ResetPopup");
					else
						DisplayPopup("WelcomePopup");
				}
				CurtainFade();
                this.GameState=GAMESTATE.WFMAINSCREENCURTAINDISAPPEARING;
				break;
			case GAMESTATE.WFFIRTSTIMEMESSAGEACCEPTANCE:			
				DisplayPopup("HelpPopup1");
				TimerObj.Start(TIMER.MAPREFRESHEVENT,TIMER.MAPREFRESHTIMEINTERVAL);
				this.GameState=GAMESTATE.WFHELPACCEPTANCE1;
				break;
			case GAMESTATE.WFWELCOMEMESSAGEACCEPTANCE:
				// Samsung-specific
				if (keyCode==KEY.RETURN)
					WidgetAPIObj.blockNavigation(event);

				DisplayPopup("");
				DisplayHighlight("HallOfFameHighlight");
				TimerObj.Start(TIMER.ADREFRESHEVENT,TIMER.ADREFRESHTIMEINTERVAL);
				TimerObj.Start(TIMER.MAPREFRESHEVENT,TIMER.MAPREFRESHTIMEINTERVAL);
				TimerObj.Start(TIMER.REMAININGTIMEEVENT,TIMER.REMAININGTIMEINTERVAL);
				this.GameState=GAMESTATE.WFHALLOFFAMESELECTION;				
				break;
			case GAMESTATE.WFHALLOFFAMESELECTION:
				switch (keyCode) 
				{
					case KEY.UP:
						DisplayHighlight("BetHistoryHighlight");
						this.GameState=GAMESTATE.WFBETHISTORYSELECTION;
						break;
					case KEY.DOWN:
						DisplayHighlight("SendHighlight");
						this.GameState=GAMESTATE.WFSENDSELECTION;
						break;
					case KEY.LEFT:
						DisplayHighlight("Option4StakeHighlight1");
						this.GameState=GAMESTATE.OPTION4STAKEDIGIT1;
						break;
					case KEY.ENTER:
// Samsung-specific solution
						TimerObj.Stop(TIMER.ADREFRESHEVENT);
						TimerObj.Stop(TIMER.MAPREFRESHEVENT);
						$.sfScene.hide('Main');
						$.sfScene.show('HallOfFame');
						HallOfFame_DisplayDynamicContent(	NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > Account > HallOfFameResultURL"),
															NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > Account > RecommendationURL"),
															NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > Account > QRCodeURL"),
															NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > AdURL"));					
						$.sfScene.focus('HallOfFame');
						this.GameState=GAMESTATE.WFHALLOFFAMEACCEPTANCE;
						break;
				}
				break;
			case GAMESTATE.WFHALLOFFAMEACCEPTANCE:
				// Samsung-specific solution
				switch (keyCode) 
				{
					case KEY.EXIT:
						WidgetAPIObj.blockNavigation(event);
						HallOfFame_DisplayExitPopup(true);
						this.GameState=GAMESTATE.WFHALLOFFAMEEXITACCEPTANCE;				
						break;
					case KEY.RETURN:
						WidgetAPIObj.blockNavigation(event);	// break is missing intentionally
					default:
						$.sfScene.hide('HallOfFame');
						$.sfScene.show('Main');
						$.sfScene.focus('Main');
						TimerObj.Start(TIMER.ADREFRESHEVENT,TIMER.ADREFRESHTIMEINTERVAL);
						TimerObj.Start(TIMER.MAPREFRESHEVENT,TIMER.MAPREFRESHTIMEINTERVAL);
						this.GameState=GAMESTATE.WFHALLOFFAMESELECTION;
					
				}
				break;			
			case GAMESTATE.WFSENDSELECTION:
				switch (keyCode) 
				{
					case KEY.UP:
						DisplayHighlight("HallOfFameHighlight");
						this.GameState=GAMESTATE.WFHALLOFFAMESELECTION;
						break;
					case KEY.DOWN:
						DisplayHighlight("BetHistoryHighlight");
						this.GameState=GAMESTATE.WFBETHISTORYSELECTION;
						break;
					case KEY.LEFT:
						DisplayHighlight("Option4StakeHighlight1");
						this.GameState=GAMESTATE.OPTION4STAKEDIGIT1;
						break;
					case KEY.RIGHT:
						DisplayHighlight("Option1StakeHighlight2");
						this.GameState=GAMESTATE.OPTION1STAKEDIGIT2;
						break;
					case KEY.ENTER:
						TimerObj.Stop(TIMER.ADREFRESHEVENT);
						TimerObj.Stop(TIMER.MAPREFRESHEVENT);
						var NumberOfEmptyStakes=0;
						if (AccountObj.GetData().Option1Stake==0)
							NumberOfEmptyStakes++;
						if (AccountObj.GetData().Option2Stake==0)
							NumberOfEmptyStakes++;
						if (AccountObj.GetData().Option3Stake==0)
							NumberOfEmptyStakes++;
						if (AccountObj.GetData().Option4Stake==0)
							NumberOfEmptyStakes++;
						if (NumberOfEmptyStakes==4)		// No bet
						{
							DisplayPopup("SendPopup_NoBet");
							this.GameState=GAMESTATE.WFSENDWARNINGACCEPTANCE;
						}
						if (NumberOfEmptyStakes<=1)		// Too much colors are selected
						{
							DisplayPopup("SendPopup_TooMuchColors");
							this.GameState=GAMESTATE.WFSENDWARNINGACCEPTANCE;
						}
						if (NumberOfEmptyStakes==2 || NumberOfEmptyStakes==3)
						{
							NetworkObj.StartCommunicationWithServer(	NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > UploadStakeURL"),
																		"PUT", 
																		NetworkObj.ConvertToXML({   AccountEncodedID:	AccountObj.GetData().EncodedID,
                                                                                                    Option1Stake: 		AccountObj.GetData().Option1Stake,
																									Option2Stake: 		AccountObj.GetData().Option2Stake,
																									Option3Stake: 		AccountObj.GetData().Option3Stake,
																									Option4Stake: 		AccountObj.GetData().Option4Stake}));
							TimerObj.Start(TIMER.UPLOADSTAKETIMEOUTEVENT,TIMER.NETWORKTIMEOUT);
							DisplayPopup("SendPopup_Wait");
							this.GameState=GAMESTATE.WFSENDCOMPLETION;
						}
						break;
				}
				break;
			case GAMESTATE.WFSENDWARNINGACCEPTANCE:				// Intentional
			case GAMESTATE.WFSENDCOMPLETIONACCEPTANCE:
				// Samsung-specific
				if (keyCode==KEY.RETURN)
					WidgetAPIObj.blockNavigation(event);

				DisplayPopup("");
				TimerObj.Start(TIMER.ADREFRESHEVENT,TIMER.ADREFRESHTIMEINTERVAL);
				TimerObj.Start(TIMER.MAPREFRESHEVENT,TIMER.MAPREFRESHTIMEINTERVAL);
				this.GameState=GAMESTATE.WFSENDSELECTION;
				break;
			case GAMESTATE.OPTION4STAKEDIGIT1:
				switch (keyCode) 
				{
					case KEY.RIGHT:
						DisplayHighlight("SendHighlight");
						this.GameState=GAMESTATE.WFSENDSELECTION;
						break;
					case KEY.LEFT:
						DisplayHighlight("Option4StakeHighlight2");
						this.GameState=GAMESTATE.OPTION4STAKEDIGIT2;
						break;
					case KEY.UP:
						AccountObj.ChangeStake(4,1);
						break;
					case KEY.DOWN:
						AccountObj.ChangeStake(4,-1);
						break;
				}
				break;
			case GAMESTATE.OPTION4STAKEDIGIT2:
				switch (keyCode) 
				{
					case KEY.RIGHT:
						DisplayHighlight("Option4StakeHighlight1");
						this.GameState=GAMESTATE.OPTION4STAKEDIGIT1;
						break;
					case KEY.LEFT:
						DisplayHighlight("Option3StakeHighlight1");
						this.GameState=GAMESTATE.OPTION3STAKEDIGIT1;
						break;
					case KEY.UP:
						AccountObj.ChangeStake(4,10);
						break;
					case KEY.DOWN:
						AccountObj.ChangeStake(4,-10);
						break;
				}
				break;
			case GAMESTATE.OPTION3STAKEDIGIT1:
				switch (keyCode) 
				{
					case KEY.RIGHT:
						DisplayHighlight("Option4StakeHighlight2");
						this.GameState=GAMESTATE.OPTION4STAKEDIGIT2;
						break;
					case KEY.LEFT:
						DisplayHighlight("Option3StakeHighlight2");
						this.GameState=GAMESTATE.OPTION3STAKEDIGIT2;
						break;
					case KEY.UP:
						AccountObj.ChangeStake(3,1);
						break;
					case KEY.DOWN:
						AccountObj.ChangeStake(3,-1);
						break;
				}
				break;
			case GAMESTATE.OPTION3STAKEDIGIT2:
				switch (keyCode) 
				{
					case KEY.RIGHT:
						DisplayHighlight("Option3StakeHighlight1");
						this.GameState=GAMESTATE.OPTION3STAKEDIGIT1;
						break;
					case KEY.LEFT:
						DisplayHighlight("Option2StakeHighlight1");
						this.GameState=GAMESTATE.OPTION2STAKEDIGIT1;
						break;
					case KEY.UP:
						AccountObj.ChangeStake(3,10);
						break;
					case KEY.DOWN:
						AccountObj.ChangeStake(3,-10);
						break;
				}
				break;
			case GAMESTATE.OPTION2STAKEDIGIT1:
				switch (keyCode) 
				{
					case KEY.RIGHT:
						DisplayHighlight("Option3StakeHighlight2");
						this.GameState=GAMESTATE.OPTION3STAKEDIGIT2;
						break;
					case KEY.LEFT:
						DisplayHighlight("Option2StakeHighlight2");
						this.GameState=GAMESTATE.OPTION2STAKEDIGIT2;
						break;
					case KEY.UP:
						AccountObj.ChangeStake(2,1);
						break;
					case KEY.DOWN:
						AccountObj.ChangeStake(2,-1);
						break;
				}
				break;
			case GAMESTATE.OPTION2STAKEDIGIT2:
				switch (keyCode) 
				{
					case KEY.RIGHT:
						DisplayHighlight("Option2StakeHighlight1");
						this.GameState=GAMESTATE.OPTION2STAKEDIGIT1;
						break;
					case KEY.LEFT:
						DisplayHighlight("Option1StakeHighlight1");
						this.GameState=GAMESTATE.OPTION1STAKEDIGIT1;
						break;
					case KEY.UP:
						AccountObj.ChangeStake(2,10);
						break;
					case KEY.DOWN:
						AccountObj.ChangeStake(2,-10);
						break;
				}
				break;
			case GAMESTATE.OPTION1STAKEDIGIT1:
				switch (keyCode) 
				{
					case KEY.RIGHT:
						DisplayHighlight("Option2StakeHighlight2");
						this.GameState=GAMESTATE.OPTION2STAKEDIGIT2;
						break;
					case KEY.LEFT:
						DisplayHighlight("Option1StakeHighlight2");
						this.GameState=GAMESTATE.OPTION1STAKEDIGIT2;
						break;
					case KEY.UP:
						AccountObj.ChangeStake(1,1);
						break;
					case KEY.DOWN:
						AccountObj.ChangeStake(1,-1);
						break;
				}
				break;
			case GAMESTATE.OPTION1STAKEDIGIT2:
				switch (keyCode) 
				{
					case KEY.LEFT:
						DisplayHighlight("SendHighlight");
						this.GameState=GAMESTATE.WFSENDSELECTION;
						break;
					case KEY.RIGHT:
						DisplayHighlight("Option1StakeHighlight1");
						this.GameState=GAMESTATE.OPTION1STAKEDIGIT1;
						break;
					case KEY.UP:
						AccountObj.ChangeStake(1,10);
						break;
					case KEY.DOWN:
						AccountObj.ChangeStake(1,-10);
						break;
				}
				break;
			case GAMESTATE.WFBETHISTORYSELECTION:
				switch (keyCode) 
				{
					case KEY.UP:
						DisplayHighlight("SendHighlight");
						this.GameState=GAMESTATE.WFSENDSELECTION;
						break;
					case KEY.DOWN:
						DisplayHighlight("HallOfFameHighlight");
						this.GameState=GAMESTATE.WFHALLOFFAMESELECTION;
						break;
					case KEY.LEFT:
						DisplayHighlight("Option4StakeHighlight1");
						this.GameState=GAMESTATE.OPTION4STAKEDIGIT1;
						break;
					case KEY.ENTER:
// Samsung-specific solution
						TimerObj.Stop(TIMER.ADREFRESHEVENT);
						TimerObj.Stop(TIMER.MAPREFRESHEVENT);
						$.sfScene.hide('Main');
						$.sfScene.show('BetHistory');
						BetHistory_DisplayDynamicContent(	NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > Account > BetHistoryResultURL"),
															NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > Account > RecommendationURL"),
															NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > Account > QRCodeURL"),
															NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > AdURL"));					
						$.sfScene.focus('BetHistory');
						this.GameState=GAMESTATE.WFBETHISTORYACCEPTANCE;
						break;
				}
				break;
			case GAMESTATE.WFBETHISTORYACCEPTANCE:
				// Samsung-specific solution
				switch (keyCode) 
				{
					case KEY.EXIT:
						WidgetAPIObj.blockNavigation(event);
						BetHistory_DisplayExitPopup(true);
						this.GameState=GAMESTATE.WFBETHISTORYEXITACCEPTANCE;				
						break;
					case KEY.RETURN:
						WidgetAPIObj.blockNavigation(event);	// break is missing intentionally
					default:
						$.sfScene.hide('BetHistory');
						$.sfScene.show('Main');
						$.sfScene.focus('Main');
						TimerObj.Start(TIMER.ADREFRESHEVENT,TIMER.ADREFRESHTIMEINTERVAL);
						TimerObj.Start(TIMER.MAPREFRESHEVENT,TIMER.MAPREFRESHTIMEINTERVAL);
						this.GameState=GAMESTATE.WFBETHISTORYSELECTION;				
				}
				break;
			case GAMESTATE.WFHELPACCEPTANCE1:
				switch (keyCode) 
				{
					case KEY.RIGHT:
						DisplayPopup("HelpPopup2");
						// Samsung specific solution: preload next help screen for faster rendering
						ImagePreLoading=new Image();
						ImagePreLoading.src=SettingsObj.GetLocalizedImagePath("HelpPopup3_960.png");
						
						this.GameState=GAMESTATE.WFHELPACCEPTANCE2;
						break;
					case KEY.RETURN:		// Samsung-specific; break is missing intentionally
						WidgetAPIObj.blockNavigation(event);
					case KEY.ENTER:
						DisplayPopup("");
						DisplayHighlight("HallOfFameHighlight");
						TimerObj.Start(TIMER.ADREFRESHEVENT,TIMER.ADREFRESHTIMEINTERVAL);
						this.GameState=GAMESTATE.WFHALLOFFAMESELECTION;
						break;
				}
				break;
			case GAMESTATE.WFHELPACCEPTANCE2:
				switch (keyCode) 
				{
					case KEY.LEFT:
						DisplayPopup("HelpPopup1");
						this.GameState=GAMESTATE.WFHELPACCEPTANCE1;
						break;
					case KEY.RIGHT:
						DisplayPopup("HelpPopup3");
						// Samsung specific solution: preload next help screen for faster rendering
						ImagePreLoading=new Image();
						ImagePreLoading.src=SettingsObj.GetLocalizedImagePath("HelpPopup4_960.png");

						this.GameState=GAMESTATE.WFHELPACCEPTANCE3;
						break;
					case KEY.RETURN:		// Samsung-specific; break is missing intentionally
						WidgetAPIObj.blockNavigation(event);
					case KEY.ENTER:
						DisplayPopup("");
						DisplayHighlight("HallOfFameHighlight");
						TimerObj.Start(TIMER.ADREFRESHEVENT,TIMER.ADREFRESHTIMEINTERVAL);
						this.GameState=GAMESTATE.WFHALLOFFAMESELECTION;
						break;
				}
				break;
			case GAMESTATE.WFHELPACCEPTANCE3:
				switch (keyCode) 
				{
					case KEY.LEFT:
						DisplayPopup("HelpPopup2");
						this.GameState=GAMESTATE.WFHELPACCEPTANCE2;
						break;
					case KEY.RIGHT:
						DisplayPopup("HelpPopup4");
						// Samsung specific solution: preload next help screen for faster rendering
						ImagePreLoading=new Image();
						ImagePreLoading.src=SettingsObj.GetLocalizedImagePath("HelpPopup5_960.png");

						this.GameState=GAMESTATE.WFHELPACCEPTANCE4;
						break;
					case KEY.RETURN:		// Samsung-specific; break is missing intentionally
						WidgetAPIObj.blockNavigation(event);
					case KEY.ENTER:
						DisplayPopup("");
						DisplayHighlight("HallOfFameHighlight");
						TimerObj.Start(TIMER.ADREFRESHEVENT,TIMER.ADREFRESHTIMEINTERVAL);
						this.GameState=GAMESTATE.WFHALLOFFAMESELECTION;
						break;
				}
				break;
			case GAMESTATE.WFHELPACCEPTANCE4:
				switch (keyCode) 
				{
					case KEY.LEFT:
						DisplayPopup("HelpPopup3");
						this.GameState=GAMESTATE.WFHELPACCEPTANCE3;
						break;
					case KEY.RIGHT:
						DisplayPopup("HelpPopup5");
						// Samsung specific solution: preload next help screen for faster rendering
						ImagePreLoading=new Image();
						ImagePreLoading.src=SettingsObj.GetLocalizedImagePath("HelpPopup6_960.png");

						this.GameState=GAMESTATE.WFHELPACCEPTANCE5;
						break;
					case KEY.RETURN:		// Samsung-specific; break is missing intentionally
						WidgetAPIObj.blockNavigation(event);
					case KEY.ENTER:
						DisplayPopup("");
						DisplayHighlight("HallOfFameHighlight");
						TimerObj.Start(TIMER.ADREFRESHEVENT,TIMER.ADREFRESHTIMEINTERVAL);
						this.GameState=GAMESTATE.WFHALLOFFAMESELECTION;
						break;
				}
				break;
			case GAMESTATE.WFHELPACCEPTANCE5:
				switch (keyCode) 
				{
					case KEY.LEFT:
						DisplayPopup("HelpPopup4");
						this.GameState=GAMESTATE.WFHELPACCEPTANCE4;
						break;
					case KEY.RIGHT:
						DisplayPopup("HelpPopup6");
						this.GameState=GAMESTATE.WFHELPACCEPTANCE6;
						break;
					case KEY.RETURN:		// Samsung-specific; break is missing intentionally
						WidgetAPIObj.blockNavigation(event);
					case KEY.ENTER:
						DisplayPopup("");
						DisplayHighlight("HallOfFameHighlight");
						TimerObj.Start(TIMER.ADREFRESHEVENT,TIMER.ADREFRESHTIMEINTERVAL);
						this.GameState=GAMESTATE.WFHALLOFFAMESELECTION;
						break;
				}
				break;
			case GAMESTATE.WFHELPACCEPTANCE6:
				switch (keyCode) 
				{
					case KEY.LEFT:
						DisplayPopup("HelpPopup5");
						this.GameState=GAMESTATE.WFHELPACCEPTANCE5;
						break;
					case KEY.RETURN:		// Samsung-specific; break is missing intentionally
						WidgetAPIObj.blockNavigation(event);
					case KEY.ENTER:
						DisplayPopup("");
						DisplayHighlight("HallOfFameHighlight");
						TimerObj.Start(TIMER.ADREFRESHEVENT,TIMER.ADREFRESHTIMEINTERVAL);
						this.GameState=GAMESTATE.WFHALLOFFAMESELECTION;
						break;
				}
				break;
			case GAMESTATE.WFEXITACCEPTANCE:
				// Samsung-specific solution
				switch (keyCode)
				{
					case KEY.ENTER:
						WidgetAPIObj.sendExitEvent(); 		// Return to TV screen
						break;
					case KEY.EXIT:
					case KEY.RETURN:						// break is missing intentionally
						WidgetAPIObj.blockNavigation(event);
					default:
						DisplayPopup("");
						DisplayHighlight("HallOfFameHighlight");
						this.GameState=GAMESTATE.WFHALLOFFAMESELECTION;					
				}
				break;
			case GAMESTATE.WFHALLOFFAMEEXITACCEPTANCE:
				// Samsung-specific solution
				switch (keyCode)
				{
					case KEY.ENTER:
						WidgetAPIObj.sendExitEvent(); 		// Return to TV screen
						break;
					case KEY.EXIT:
					case KEY.RETURN:						// break is missing intentionally
						WidgetAPIObj.blockNavigation(event);
					default:
						HallOfFame_DisplayExitPopup(false);
						this.GameState=GAMESTATE.WFHALLOFFAMEACCEPTANCE;					
				}
				break;
			case GAMESTATE.WFBETHISTORYEXITACCEPTANCE:
				// Samsung-specific solution
				switch (keyCode)
				{
					case KEY.ENTER:
						WidgetAPIObj.sendExitEvent(); 		// Return to TV screen
						break;
					case KEY.EXIT:
					case KEY.RETURN:						// break is missing intentionally
						WidgetAPIObj.blockNavigation(event);
					default:
						BetHistory_DisplayExitPopup(false);
						this.GameState=GAMESTATE.WFBETHISTORYACCEPTANCE;					
				}
				break;		
			case GAMESTATE.WFRETURNACCEPTANCE:
				// Samsung-specific solution
				switch (keyCode)
				{
					case KEY.ENTER:
						WidgetAPIObj.sendReturnEvent();		// Return to TV screen
						break;
					case KEY.EXIT:
					case KEY.RETURN:						// break is missing intentionally
						WidgetAPIObj.blockNavigation(event);
					default:
						DisplayPopup("");
						DisplayHighlight("HallOfFameHighlight");
						this.GameState=GAMESTATE.WFHALLOFFAMESELECTION;					
				}
				break;
		}
	};

	this.TimerEventHandler=function(EventCode)
	{
		switch (EventCode)
		{
			case TIMER.SCREENSAVERSTOPTIMEEVENT:
				// Screensaver workaround: in a project with scenes the official Samsung screensaver method is not working
				// There is no good place to call the setOffScreenSaver() method: it is not working in Init, handleShow, network callback, etc.
				// We put it here
				PluginAPIObj.setOffScreenSaver();		// Samsung QA request
				break;
			case TIMER.DOWNLOADSUMMARYTIMEOUTEVENT:	
				DisplayLoadingMessage("Error");
				this.GameState=GAMESTATE.WFLOADINGSCREENBLOCKERACCEPTANCE;
				break;
			case TIMER.MAINSCREENCURTAINDISAPPEAREDEVENT:
				SoundPlayerObj.Play(NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > BackgroundMusicURL"));
				if (NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > Account > IsNewAccount")=="TRUE")
					this.GameState=GAMESTATE.WFFIRTSTIMEMESSAGEACCEPTANCE;
				else
					this.GameState=GAMESTATE.WFWELCOMEMESSAGEACCEPTANCE;					
				break;
			case TIMER.MAPREFRESHEVENT:
				var StakeRatioSum=0;
				for (var i=1;i<=4;i++)
					StakeRatioSum+=parseInt(NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > ActualRound > Option" + i + "StakeRatio"));
				var StakeRatioSum2=0;	// Can be different from StakeRatioSum because of bets from not identified countries & multiple options in one stake
				for (var i=1;i<=6;i++)
					StakeRatioSum2+=parseInt(NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > ActualRound > Region" + i + "StakeRatio"));
				if (StakeRatioSum>0 && StakeRatioSum2>0)	// Flash map if there is at least 1 region & 1 option
				{
					var Rnd=Math.floor(Math.random()*StakeRatioSum);
					var SelectedOption=4;
					for (var i=1;i<=4;i++)
					{
						if (Rnd<parseInt(NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > ActualRound > Option" + i + "StakeRatio")))
						{
							SelectedOption=i;
							break;
						}
						else
							Rnd-=parseInt(NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > ActualRound > Option" + i + "StakeRatio"));
					}
					var Rnd2=Math.floor(Math.random()*StakeRatioSum2);
					var SelectedRegion=6;
					for (var i=1;i<=6;i++)
					{
						if (Rnd2<parseInt(NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > ActualRound > Region" + i + "StakeRatio")))
						{
							SelectedRegion=i;
							break;
						}
						else
							Rnd2-=parseInt(NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > ActualRound > Region" + i + "StakeRatio"));
					}				
					DisplayMap(SelectedOption,SelectedRegion);
					var Rnd3=Math.random()*0.7+0.25;		// 0.25-0.95				
					TimerObj.Start(TIMER.MAPREFRESHEVENT,Math.floor(-1000*Math.log(1-Rnd3)/0.7));
				}
				break;
			case TIMER.ADREFRESHEVENT:
				DisplayAd(NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > AdURL"));
				TimerObj.Start(TIMER.ADREFRESHEVENT,TIMER.ADREFRESHTIMEINTERVAL);
				break;
			case TIMER.REMAININGTIMEEVENT:
				$('#TimeDigitGroup').fadeOut(2000);
				$('#RemainingTime').fadeOut(2000);
				break;
			case TIMER.UPLOADSTAKETIMEOUTEVENT:
				DisplayPopup("SendPopup_Error");
				this.GameState=GAMESTATE.WFSENDCOMPLETIONACCEPTANCE;
				break;
		}
	};
	
	this.NetworkEventHandler=function(URL)
	{
		if (NetworkObj.IsCommunicationCompleted(URL))
        {
			switch (URL)
			{
				case NETWORK.DOWNLOADSUMMARYURL:
					TimerObj.Stop(TIMER.DOWNLOADSUMMARYTIMEOUTEVENT);
					if (NetworkObj.GetDataFromDownloadedXMLData(URL,"Summary > LoadingMessage > Type")=="Blocker")		// Works in case of no existing <Type> tag as well
					{
						DisplayLoadingMessage(NetworkObj.GetDataFromDownloadedXMLData(URL,"Summary > LoadingMessage > Message"));
						this.GameState=GAMESTATE.WFLOADINGSCREENBLOCKERACCEPTANCE;
					}
					else
					{
						AccountObj.Set(	NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > Account > EncodedID"),
										parseInt(NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > Account > Credits")),
										parseInt(NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > ActualRound > Option1Stake")),
										parseInt(NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > ActualRound > Option2Stake")),
										parseInt(NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > ActualRound > Option3Stake")),
										parseInt(NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > ActualRound > Option4Stake")));
						$.sfScene.hide('Loading');
						$.sfScene.show('Main');
						DisplayDynamicContent(	parseInt(NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > Account > EloPoints")),
												NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > Account > Rank"),
												parseInt(NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > Account > Position")),
												NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > LatestRound > CreditModification"),
												NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > Account > CreditsFromRecommendation"),
												parseInt(NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > ActualRound > RemainingTime")),
												NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > Account > RecommendationURL"),
												NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > Account > QRCodeURL"),
												NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > AdURL"),
												AccountObj.GetData().Credits,
												AccountObj.GetData().Option1Stake,
												AccountObj.GetData().Option2Stake,
												AccountObj.GetData().Option3Stake,
												AccountObj.GetData().Option4Stake,
												NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > Account > HallOfFameResultURL"),
												NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > Account > BetHistoryResultURL"));
						if (NetworkObj.GetDataFromDownloadedXMLData(URL,"Summary > LoadingMessage > Type")=="Info")		// Works in case of no existing <Type> tag as well
						{
							DisplayLoadingMessage(NetworkObj.GetDataFromDownloadedXMLData(URL,"Summary > LoadingMessage > Message"));
							this.GameState=GAMESTATE.WFLOADINGSCREENINFOACCEPTANCE;
						}
						else
						{
							if (NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > Account > IsNewAccount")=="TRUE")
								DisplayPopup("FirstTimePopup");
							else
							{
								if (NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > Account > IsNotificationNeededAboutReset")=="TRUE")
									DisplayPopup("ResetPopup");
								else
									DisplayPopup("WelcomePopup");
							}
							CurtainFade();
							this.GameState=GAMESTATE.WFMAINSCREENCURTAINDISAPPEARING;
						}
						// Samsung-specific solution: preload 1st Help screen & Ranking & History images for faster rendering
						var ImagePreLoading=new Array();
						ImagePreLoading[0]=new Image();
						ImagePreLoading[0].src=NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > Account > HallOfFameResultURL"); 
						ImagePreLoading[1]=new Image();
						ImagePreLoading[1].src=NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > Account > BetHistoryResultURL");
						ImagePreLoading[2]=new Image();
						ImagePreLoading[2].src=SettingsObj.GetLocalizedImagePath("HelpPopup1_960.png");
					}
                    break;
				case NetworkObj.GetDataFromDownloadedXMLData(NETWORK.DOWNLOADSUMMARYURL,"Summary > UploadStakeURL"):
					TimerObj.Stop(TIMER.UPLOADSTAKETIMEOUTEVENT);
					var IsAnswerExists=NetworkObj.GetDataFromDownloadedXMLData(URL,"Answer > Message")==="" ? false : true;
					if (IsAnswerExists)
					{
						switch (NetworkObj.GetDataFromDownloadedXMLData(URL,"Answer > Message"))
						{
							case "Completed":
								DisplayPopup("SendPopup_Completed");
								break;
							case "EvaluationInProgress":
								DisplayPopup("SendPopup_EvaluationInProgress");
								break;
							case "NotEnoughGold":
								DisplayPopup("SendPopup_NotEnoughGold");
								break;
							default:
								DisplayPopup("SendPopup_Error");
						}
					}
					else
						DisplayPopup("SendPopup_Error");
					this.GameState=GAMESTATE.WFSENDCOMPLETIONACCEPTANCE;
					break;
			}
		}
	};
}

function Account()
{   
    var EncodedID=null;
	var Credits=null;
	var Option1Stake=null;
	var Option2Stake=null;
	var Option3Stake=null;
	var Option4Stake=null;

	this.Set=function(EncodedIDValue,CreditsValue,Option1StakeValue,Option2StakeValue,Option3StakeValue,Option4StakeValue)
    {
		EncodedID=EncodedIDValue;
		Credits=CreditsValue;
		Option1Stake=Option1StakeValue;
		Option2Stake=Option2StakeValue;
		Option3Stake=Option3StakeValue;
		Option4Stake=Option4StakeValue;
    };
 
	this.ChangeStake=function(OptionNumber,Modification)
    {
		if (OptionNumber==1 && Option1Stake+Modification>=0 && Option1Stake+Option2Stake+Option3Stake+Option4Stake+Modification<=Credits)
			Option1Stake+=Modification;
		if (OptionNumber==2 && Option2Stake+Modification>=0 && Option1Stake+Option2Stake+Option3Stake+Option4Stake+Modification<=Credits)
			Option2Stake+=Modification;
		if (OptionNumber==3 && Option3Stake+Modification>=0 && Option1Stake+Option2Stake+Option3Stake+Option4Stake+Modification<=Credits)
			Option3Stake+=Modification;
		if (OptionNumber==4 && Option4Stake+Modification>=0 && Option1Stake+Option2Stake+Option3Stake+Option4Stake+Modification<=Credits)
			Option4Stake+=Modification;
		DisplayStakesAndAvailableCredits(Credits,Option1Stake,Option2Stake,Option3Stake,Option4Stake);
    }; 
	
	this.GetData=function()
    {
        return {EncodedID:EncodedID, Credits:Credits, Option1Stake:Option1Stake, Option2Stake:Option2Stake, Option3Stake:Option3Stake, Option4Stake:Option4Stake};
    };
}

function SamsungSmartTVNetwork()
{
    var Requests=new Object();		// Stores XMLHTTPRequest objects similar to associative arrays

    this.StartCommunicationWithServer=function(URL,Method,DataToUpload)
    {
        if (Requests[URL]!=null)			
			Requests[URL].destroy();				// Deallocate (Samsung SmartTV-specific method)
        Requests[URL]=new XMLHttpRequest();
        Requests[URL].open(Method,URL,true);
		Requests[URL].onreadystatechange=function() {GameEngineObj.NetworkEventHandler(URL)};
        if (Method=="PUT")
		{
            Requests[URL].setRequestHeader('Content-Type','application/x-www-form-urlencoded');
			Requests[URL].setRequestHeader("Content-length", DataToUpload.length);
			Requests[URL].setRequestHeader("Connection", "close");
		}
		Requests[URL].send(DataToUpload);
    };
	
	this.IsCommunicationCompleted=function(URL)
    {
        if (Requests[URL].readyState==4 && Requests[URL].status==200)
            return true;
        else
            return false;
    };
	
	this.GetDataFromDownloadedXMLData=function(URL,Expression)
    { 
alert(Requests[URL].responseText);
		return $(Requests[URL].responseXML).find(Expression).text();
    };

	this.Destroy=function()
	{
		for (Element in Requests)
		{
			if (typeof(Requests[Element])=="object")
				Requests[Element].destroy();
		}
	};
	
	this.ConvertToXML=function(Object)
	{
		XML="<?xml version=\"1.0\" encoding=\"utf-8\" ?><Object>";
		for (var i in Object)
			XML+="<" + i + ">" + Object[i] + "</" + i + ">";
		XML+="</Object>";
		return XML;
	};
}

function SamsungSmartTVTimer()
{
    var TimerHandle=new Object();		// Stores timer handles similar to associative arrays

    this.Start=function(EventCode,TimeInterval)
    {
        TimerHandle[EventCode]=setTimeout(function(){GameEngineObj.TimerEventHandler(EventCode)},TimeInterval);
    };

    this.Stop=function(EventCode)
    {
        clearTimeout(TimerHandle[EventCode]);
    };
} 

function SamsungSmartTVSettings()
{
	var SystemLanguage=SYSTEMLANGUAGE;
	var LocalizedTextDirectory=LOCALIZEDTEXTDIRECTORY;
	
	this.GetLanguage=function()
    {
        return SystemLanguage;
    };
	
	this.GetLocalizedImagePath=function(ImageFileName) 
	{
		return(LocalizedTextDirectory + ImageFileName);
	};
}

function SamsungSmartTVSoundPlayer()
{
	var Player=document.getElementById("pluginPlayer");
	var Audio=document.getElementById("pluginAudio");
	var ProductType=document.getElementById("pluginTV").GetProductType();
	
	this.Play=function(URL)
    {
		// In case of local MP3 file (->server sends '$WIDGET/...' path) the 2012 models can't handle the path as $WIDGET is not defined
		// We must convert this $WIDGET/... parh it to the path format of the 2012 models
		if (URL.slice(0,8)=='$WIDGET/' && window.location.href.indexOf('localhost')==-1)
		{	
			var RootPath = decodeURI(window.location.href.substring(0,window.location.href.lastIndexOf('/')+1)); 
			if (RootPath.slice(0,9)=='file://D/')			// In case of PC IDE (Depends on the installation path of the SDK!!!)
				RootPath='D:/' + RootPath.slice(9);
			else											// Real TV
				RootPath=RootPath.slice(7);					// Remove the leading 'file://'
			URL=RootPath+URL.slice(8);
		}
		Player.Play(URL);
    };
	
	this.Stop=function() 
	{
		Player.Stop();
	};
	
	this.VolumeUp=function() 
	{
		if (ProductType!=2 && Audio.GetOutputDevice()!=3)
			Audio.SetVolumeWithKey(0);			// Up
	};
	
	this.VolumeDown=function() 
	{
		if (ProductType!=2 && Audio.GetOutputDevice()!=3)
			Audio.SetVolumeWithKey(1);			// Down
	};
	
	this.VolumeMute=function() 
	{
		var NewValue=Audio.GetUserMute() ? 0 : 1;
		Audio.SetUserMute(NewValue); 
	};
}

// Wrapper functions to make port/maintenance easier
SetSource=function(Object,Source)
{
	$("#" + Object).css("background-image", "url(" + Source + ")");
}

Show=function(Object)
{
	$("#" + Object).show();
}

Hide=function(Object)
{
	$("#" + Object).hide();
}