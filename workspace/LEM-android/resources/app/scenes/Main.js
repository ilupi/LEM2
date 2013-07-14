function SceneMain(options) 
{
	this.options = options;
}

SceneMain.prototype.initialize = function () 
{

	// Init localized texts
	SetSource("Main_Background",SettingsObj.GetLocalizedImagePath("Background_Samsung_960.jpg"));
	SetSource("Curtain",SettingsObj.GetLocalizedImagePath("Loading_960.jpg"));
	SetSource("HallOfFameHighlight",SettingsObj.GetLocalizedImagePath("HallOfFameHighlight_960.png"));
	SetSource("SendHighlight",SettingsObj.GetLocalizedImagePath("SendHighlight_960.png"));
	SetSource("BetHistoryHighlight",SettingsObj.GetLocalizedImagePath("BetHistoryHighlight_960.png"));
	SetSource("CreditsChangeNoBet",SettingsObj.GetLocalizedImagePath("CreditsChangeNoBet_960.png"));
	SetSource("RecommendationResultNull",SettingsObj.GetLocalizedImagePath("RecommendationResultNull_960.png"));
	
	// Init "localized" coordinates
	$('#RankDigitGroup').css("left",LOCALIZEDRANKDIGITGROUPLEFT);
	$('#TimeDigitGroup').css("left",LOCALIZEDTIMEDIGITGROUPLEFT);
}

SceneMain.prototype.handleShow = function () {}

SceneMain.prototype.handleHide = function () {
	
	// Release memory
	SetSource("Curtain","/images/White1x1px.png");		// It is not neccessary in the future at all (visible only at the start of the scene, not after handleHide)		
}

SceneMain.prototype.handleFocus = function () {}

SceneMain.prototype.handleBlur = function () {}

SceneMain.prototype.handleKeyDown = function (keyCode) 
{
	GameEngineObj.KeyEventHandler(keyCode);
}

DisplayDynamicContent = function(EloPoints,Rank,Position,CreditsChange,CreditsChangeFromRecommendation,RemainingTime,RecommendationURL,QRCodeURL,AdURL,Credits,Option1Stake,Option2Stake,Option3Stake,Option4Stake,HallOfFameResultURL,BetHistoryResultURL)
{
	if (EloPoints>=1000)
		SetSource("EloPointsDigit4","images/Nr" + Math.floor(EloPoints / 1000) % 10  + "_size32_960.png");
	else
		Hide("EloPointsDigit4");
	if (EloPoints>=100)
		SetSource("EloPointsDigit3","images/Nr" + Math.floor(EloPoints / 100) % 10  + "_size32_960.png");
	else
		Hide("EloPointsDigit3");
	if (EloPoints>=10)
		SetSource("EloPointsDigit2","images/Nr" + Math.floor(EloPoints / 10) % 10  + "_size32_960.png");
	else
		Hide("EloPointsDigit2");
	SetSource("EloPointsDigit1","images/Nr" + EloPoints % 10 + "_size32_960.png");

	if (Rank.substring(0,5)=="Level")
		SetSource("Rank",SettingsObj.GetLocalizedImagePath(Rank + "_960.png"));
	if (Rank.substring(0,7)=="http://")
		SetSource("Rank",Rank);

	if (Position>=10)
		SetSource("RankDigit2","images/Nr" + Math.floor(Position / 10) % 10  + "_size24_960.png");
	else
		Hide("RankDigit2");
	SetSource("RankDigit1","images/Nr" + Position % 10 + "_size24_960.png");

	if (CreditsChange=="NULL")
	{
		Show("CreditsChangeNoBet");
		Hide("CreditsChangeSign");
		Hide("CreditsChangeDigit3");
		Hide("CreditsChangeDigit2");
		Hide("CreditsChangeDigit1");
		Hide("CreditsChangePlus");
	}
	else
	{
		Hide("CreditsChangeNoBet");
		CreditsChangeNumber=parseInt(CreditsChange);

		if (CreditsChangeNumber>0)
			SetSource("CreditsChangeSign","images/Nr+_size32_960.png");
		if (CreditsChangeNumber<0)
			SetSource("CreditsChangeSign","images/Nr-_size32_960.png");

		if (Math.abs(CreditsChangeNumber)>999)
		{
			Show("CreditsChangePlus");
			NumberToDisplay=999;
		}
		else
		{
			Hide("CreditsChangePlus");
			NumberToDisplay=Math.abs(CreditsChangeNumber);
		}
		if (NumberToDisplay>=100)
			SetSource("CreditsChangeDigit3","images/Nr" + Math.floor(NumberToDisplay / 100) % 10  + "_size32_960.png");
		else
			Hide("CreditsChangeDigit3");
		if (NumberToDisplay>=10)
			SetSource("CreditsChangeDigit2","images/Nr" + Math.floor(NumberToDisplay / 10) % 10  + "_size32_960.png");
		else
			Hide("CreditsChangeDigit2");
		SetSource("CreditsChangeDigit1","images/Nr" + NumberToDisplay % 10  + "_size32_960.png");
	}

	if (CreditsChangeFromRecommendation==0)
	{
		Show("RecommendationResultNull");
		Hide("RecommendationResultDigit2");
		Hide("RecommendationResultDigit1");
	}
	else
	{
		Hide("RecommendationResultNull");
		CreditsChangeFromRecommendationNumber=parseInt(CreditsChangeFromRecommendation);
		if (CreditsChangeFromRecommendationNumber>=10)
			SetSource("RecommendationResultDigit2","images/Nr" + Math.floor(CreditsChangeFromRecommendationNumber / 10) % 10  + "_size32_960.png");
		else
			Hide("RecommendationResultDigit2");
		SetSource("RecommendationResultDigit1","images/Nr" + CreditsChangeFromRecommendationNumber % 10 + "_size32_960.png");
	}

	if (RemainingTime>60)
	{
		var RemainingHours=Math.floor(RemainingTime/60);
		if (RemainingHours>=10)
			SetSource("TimeDigit2","images/Nr" + Math.floor(RemainingHours / 10) % 10 + "_size24_960.png");
		else
			Hide("TimeDigit2");
		SetSource("TimeDigit1","images/Nr" + RemainingHours % 10 + "_size24_960.png");
		SetSource("RemainingTime",SettingsObj.GetLocalizedImagePath("HoursLeft_960.png"));
	}
	else
	{
		if (RemainingTime>=10)
			SetSource("TimeDigit2","images/Nr" + Math.floor(RemainingTime / 10) % 10 + "_size24_960.png");
		else
			Hide("TimeDigit2");
		SetSource("TimeDigit1","images/Nr" + RemainingTime % 10 + "_size24_960.png");
		SetSource("RemainingTime",SettingsObj.GetLocalizedImagePath("MinutesLeft_960.png"));
	}

	$('#Main_RecommendationURL').sfLabel({text: RecommendationURL});

	SetSource("Main_QRCode",QRCodeURL);

	DisplayStakesAndAvailableCredits(Credits,Option1Stake,Option2Stake,Option3Stake,Option4Stake);
	DisplayAd(AdURL);
	DisplayMap();
	DisplayHighlight();
}

DisplayStakesAndAvailableCredits = function (Credits,Option1Stake,Option2Stake,Option3Stake,Option4Stake) 
{
	var AvailableCredits=Credits-Option1Stake-Option2Stake-Option3Stake-Option4Stake;
	if (AvailableCredits<9999)
	{
		NumberToDisplay=AvailableCredits;
		Hide("CreditsPlus");
	}
	else
	{
		NumberToDisplay=9999;
		Show("CreditsPlus");
	}
	if (NumberToDisplay>=1000)
	{
		SetSource("CreditsDigit4","images/Nr" + Math.floor(NumberToDisplay / 1000) % 10  + "_size72_960.png");
		Show("CreditsDigit4");
	}
	else
		Hide("CreditsDigit4");

	if (NumberToDisplay>=100)
	{
		SetSource("CreditsDigit3","images/Nr" + Math.floor(NumberToDisplay / 100) % 10  + "_size72_960.png");
		Show("CreditsDigit3");
	}
	else
		Hide("CreditsDigit3");
	if (NumberToDisplay>=10)
	{
		SetSource("CreditsDigit2","images/Nr" + Math.floor(NumberToDisplay / 10) % 10  + "_size72_960.png");
		Show("CreditsDigit2");
	}
	else
		Hide("CreditsDigit2");
	SetSource("CreditsDigit1","images/Nr" + NumberToDisplay % 10 + "_size72_960.png");

	SetSource("Option1StakeDigit3","images/Nr" + Math.floor(Option1Stake / 100) % 10 + "_size32_960.png");
	SetSource("Option1StakeDigit2","images/Nr" + Math.floor(Option1Stake / 10) % 10 + "_size32_960.png");
	SetSource("Option1StakeDigit1","images/Nr" + Option1Stake % 10 + "_size32_960.png");

	SetSource("Option2StakeDigit3","images/Nr" + Math.floor(Option2Stake / 100) % 10 + "_size32_960.png");
	SetSource("Option2StakeDigit2","images/Nr" + Math.floor(Option2Stake / 10) % 10 + "_size32_960.png");
	SetSource("Option2StakeDigit1","images/Nr" + Option2Stake % 10 + "_size32_960.png");

	SetSource("Option3StakeDigit3","images/Nr" + Math.floor(Option3Stake / 100) % 10 + "_size32_960.png");
	SetSource("Option3StakeDigit2","images/Nr" + Math.floor(Option3Stake / 10) % 10 + "_size32_960.png");
	SetSource("Option3StakeDigit1","images/Nr" + Option3Stake % 10 + "_size32_960.png");

	SetSource("Option4StakeDigit3","images/Nr" + Math.floor(Option4Stake / 100) % 10 + "_size32_960.png");
	SetSource("Option4StakeDigit2","images/Nr" + Math.floor(Option4Stake / 10) % 10 + "_size32_960.png");
	SetSource("Option4StakeDigit1","images/Nr" + Option4Stake % 10 + "_size32_960.png");
}

DisplayAd = function (URL) 
{
	SetSource("Main_Ad",URL + "&ZoneID=1&Rand=" + Math.floor(Math.random()*1000000));
}

DisplayMap = function (Option,RegionCode) 
{
	for (var i=1;i<=6;i++)
	{
		if (i==RegionCode)
			Show("Region"+i);
		else
			Hide("Region"+i);
	}

	for (var i=1;i<=4;i++)
	{
		if (i==Option)
		{
			Show("LightOption"+i);
			$('#LightOption' + i).fadeIn(0);
			$('#LightOption' + i).fadeOut(400);
		}
		else
			Hide("LightOption"+i);
	}
}

DisplayHighlight = function (ActiveHighlight) 
{
	var HighlightControls=[	"HallOfFameHighlight","BetHistoryHighlight","SendHighlight",
							"Option1StakeHighlight1","Option1StakeHighlight2",
							"Option2StakeHighlight1","Option2StakeHighlight2",
							"Option3StakeHighlight1","Option3StakeHighlight2",
							"Option4StakeHighlight1","Option4StakeHighlight2"];
	
	// Show active highlight & hide the others
	for (Control in HighlightControls)
	{
		if (HighlightControls[Control]==ActiveHighlight)
			Show(ActiveHighlight);
		else
			Hide(HighlightControls[Control]);
	}  
}

DisplayPopup = function (ActivePopup)
{
	switch (ActivePopup)
	{
		case "WelcomePopup":
			SetSource("FullScreenPopups",SettingsObj.GetLocalizedImagePath("CreditsChangePopup_960.png"));
			Show("FullScreenPopups");
			Show("WelcomePopupGroup");
			break;
		case "FirstTimePopup":					// Similar to the followings but it uses JPG file (no overlay needed) because of image size & memory consumption
			SetSource("FullScreenPopups",SettingsObj.GetLocalizedImagePath(ActivePopup + "_960.jpg"));
			Show("FullScreenPopups");
			Hide("WelcomePopupGroup");
			break;
		case "ResetPopup":						// Intentional
		case "SendPopup_NoBet":
		case "SendPopup_TooMuchColors":
		case "SendPopup_Wait":
		case "SendPopup_Completed":
		case "SendPopup_EvaluationInProgress":
		case "SendPopup_NotEnoughGold":
		case "SendPopup_Error":
		case "HelpPopup1":
		case "HelpPopup2":
		case "HelpPopup3":
		case "HelpPopup4":
		case "HelpPopup5":
		case "HelpPopup6":
		case "ExitPopup":
			SetSource("FullScreenPopups",SettingsObj.GetLocalizedImagePath(ActivePopup + "_960.png"));
			Show("FullScreenPopups");
			Hide("WelcomePopupGroup");
			break;
		default:
			Hide("FullScreenPopups");
			Hide("WelcomePopupGroup");
	}
}

CurtainFade=function()
{
	$('#Curtain').fadeOut(TIMER.MAINSCREENCURTAINDISAPPEARINGTIMEINTERVAL, function(){GameEngineObj.TimerEventHandler(TIMER.MAINSCREENCURTAINDISAPPEAREDEVENT)});
}