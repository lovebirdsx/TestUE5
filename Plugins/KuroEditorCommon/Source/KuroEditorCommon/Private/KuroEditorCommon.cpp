// Copyright Epic Games, Inc. All Rights Reserved.

#include "KuroEditorCommon.h"

DEFINE_LOG_CATEGORY(KuroEditorCommon);

#define LOCTEXT_NAMESPACE "FKuroEditorCommonModule"

static FKuroEditorCommonModule* Instance;

void FKuroEditorCommonModule::StartupModule()
{
	Instance = this;	
}

void FKuroEditorCommonModule::ShutdownModule()
{
	StopAllJsEnv();
	Instance = nullptr;	
}

FKuroEditorCommonModule* FKuroEditorCommonModule::GetInstance()
{
	return Instance;
}

TSharedPtr<puerts::FJsEnv> FKuroEditorCommonModule::RunJsEnv(const FString& ModuleName, UReactUMGStarter* ReactUMGStarter)
{
	auto JsEnv = MakeShared<puerts::FJsEnv>(std::make_unique<puerts::DefaultJSModuleLoader>(TEXT("Aki/JavaScript")), std::make_shared<puerts::FDefaultLogger>(), 8080);
	if (bWaitJSDebug)
	{
		JsEnv->WaitDebugger();		
	}
	TArray<TPair<FString, UObject*>> Arguments;
	Arguments.Add(TPair<FString, UObject*>(TEXT("ReactUMGStarter"), ReactUMGStarter));
	JsEnv->Start(ModuleName, Arguments);
	JsEnvs.Add(JsEnv);
	return JsEnv;
}

void FKuroEditorCommonModule::StopJsEnv(TSharedPtr<puerts::FJsEnv> JsEnv)
{
	JsEnvs.Remove(JsEnv);
	if (JsEnv.IsValid())
	{
		JsEnv.Reset();
	}
}

void FKuroEditorCommonModule::SetIfWaitJSDebug(const bool bValue)
{
	bWaitJSDebug = bValue;
}

bool FKuroEditorCommonModule::GetIfWaitJSDebug()
{
	return bWaitJSDebug;
}

void FKuroEditorCommonModule::StopAllJsEnv()
{
	for (int i = JsEnvs.Num() - 1; i >= 0; --i)
	{
		StopJsEnv(JsEnvs[i]);
	}	
}

#undef LOCTEXT_NAMESPACE
	
IMPLEMENT_MODULE(FKuroEditorCommonModule, KuroEditorCommon)