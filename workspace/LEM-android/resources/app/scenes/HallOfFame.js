function SceneHallOfFame(options) 
{
	this.options = options;
}

SceneHallOfFame.prototype.initialize = function () {}

SceneHallOfFame.prototype.handleShow = function () 
{
	// Init localized background
	// Place it here to be able to re-set after removing from the memory
	SetSource("HallOfFame_Background",SettingsObj.GetLocalizedImagePath("HallOfFameBackground_Samsung_960.jpg"));
}

SceneHallOfFame.prototype.handleHide = function () 
{
	SetSource("HallOfFame_Background","/images/White1x1px.png");		// Remove from memory
}

SceneHallOfFame.prototype.handleFocus = function () {}

SceneHallOfFame.prototype.handleBlur = function () {}

SceneHallOfFame.prototype.handleKeyDown = function (keyCode) 
{
	GameEngineObj.KeyEventHandler(keyCode);
}

HallOfFame_DisplayDynamicContent = function(ResultURL,RecommendationURL,QRCodeURL,AdURL)
{
	SetSource("HallOfFame_Results",ResultURL);

	$("#HallOfFame_RecommendationURL").sfLabel({text: RecommendationURL});

	SetSource("HallOfFame_QRCode",QRCodeURL);

	SetSource("HallOfFame_Ad",AdURL+ "&ZoneID=2&Rand=" + Math.floor(Math.random()*1000000));
}

HallOfFame_DisplayExitPopup = function(Visibility)
{
	if (Visibility)
		SetSource("HallOfFame_ExitPopup",SettingsObj.GetLocalizedImagePath("ExitPopup_960.png"));
	else
		SetSource("HallOfFame_ExitPopup","");
}