// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "EditorEvent.h"
#include "JsEnv.h"
#include "JsonConfig.h"
#include "ReactUMGStarter.h"

using namespace UE;

DECLARE_LOG_CATEGORY_EXTERN(KuroEditorCommon, Log, All);
class FKuroEditorCommonModule : public IModuleInterface
{
public:

	/** IModuleInterface implementation */
	virtual void StartupModule() override;
	virtual void ShutdownModule() override;

	static FKuroEditorCommonModule* GetInstance();	

	TSharedPtr<puerts::FJsEnv> RunJsEnv(const FString& ModuleName, UReactUMGStarter* ReactUMGStarter);
	void StopJsEnv(TSharedPtr<puerts::FJsEnv> JsEnv);

	void SetIfWaitJSDebug(bool bValue); 
	
	bool GetIfWaitJSDebug();

	UEditorEvent* GetEditorEvent() { return EditorEvent; };

	FJsonConfig* GetJsonConfig() { return JsonConfig; }

	void SaveJsonConfig();

private:
	void StopAllJsEnv();	
	TArray<TSharedPtr<puerts::FJsEnv>> JsEnvs;
	bool bWaitJSDebug = false;
	UEditorEvent *EditorEvent = nullptr;
	FJsonConfig *JsonConfig = nullptr;
};
