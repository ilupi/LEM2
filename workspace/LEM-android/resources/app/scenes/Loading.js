function SceneLoading(options)
{
	this.options = options;
}

SceneLoading.prototype.initialize = function () {}

SceneLoading.prototype.handleShow = function () 
{
	// Init localized texts
	// It won't be re-appear so this is a good place (handleShow is not required)
	SetSource("Loading_Background",SettingsObj.GetLocalizedImagePath("Loading_960.jpg"));
}

SceneLoading.prototype.handleHide = function () 
{
	SetSource("Loading_Background","/images/White1x1px.png");	// Remove from memory
}

SceneLoading.prototype.handleFocus = function () {}

SceneLoading.prototype.handleBlur = function () {}

SceneLoading.prototype.handleKeyDown = function (keyCode) 
{
	GameEngineObj.KeyEventHandler(keyCode);
}

DisplayLoadingMessage=function(Message)
{
	switch (Message)
	{
		case "EvaluationInProgress":
			SetSource("Loading_Message",SettingsObj.GetLocalizedImagePath("LoadingEvaluationInProgress_960.png"));
			break;
		case "Error":
			SetSource("Loading_Message",SettingsObj.GetLocalizedImagePath("LoadingError_960.png"));
			break;
		default:
			if (Message.substr(0,7)=="http://")
				SetSource("Loading_Message",Message);
			else
				SetSource("Loading_Message","images/White1x1px.png");		// Hide it
	}
}