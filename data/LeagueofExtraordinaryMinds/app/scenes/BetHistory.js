function SceneBetHistory(options) 
{
	this.options = options;
}

SceneBetHistory.prototype.initialize = function () {}

SceneBetHistory.prototype.handleShow = function () 
{
	// Init localized background
	// Place it here to be able to re-set after removing from the memory
	SetSource("BetHistory_Background",SettingsObj.GetLocalizedImagePath("BetHistoryBackground_Samsung_960.jpg"));
}

SceneBetHistory.prototype.handleHide = function () 
{
	SetSource("BetHistory_Background","/images/White1x1px.png");			// Remove from memory
}

SceneBetHistory.prototype.handleFocus = function () {}

SceneBetHistory.prototype.handleBlur = function () {}

SceneBetHistory.prototype.handleKeyDown = function (keyCode) 
{
	GameEngineObj.KeyEventHandler(keyCode);
}

BetHistory_DisplayDynamicContent = function(ResultURL,RecommendationURL,QRCodeURL,AdURL)
{
	SetSource("BetHistory_Results",ResultURL);

	$("#BetHistory_RecommendationURL").sfLabel({text: RecommendationURL});

	SetSource("BetHistory_QRCode",QRCodeURL);

	SetSource("BetHistory_Ad",AdURL + "&ZoneID=3&Rand=" + Math.floor(Math.random()*1000000));
}

BetHistory_DisplayExitPopup = function(Visibility)
{
	if (Visibility)
		SetSource("BetHistory_ExitPopup",SettingsObj.GetLocalizedImagePath("ExitPopup_960.png"));
	else
		SetSource("BetHistory_ExitPopup","");
}