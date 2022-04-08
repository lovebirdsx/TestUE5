#include "ReactUMGStarter.h"
#include "Editor.h"
#include "EditorUtilitySubsystem.h"
#include "LevelEditor.h"
#include "KuroEditorCommon.h"
#include "Components/Widget.h"
#include "Blutility/Classes/EditorUtilityWidgetBlueprint.h"

FName UReactUMGStarter::Start(const FString& ModuleName, UEditorUtilityWidgetBlueprint *EditorUtilityWidgetBlueprint)
{	
	const FLevelEditorModule& LevelEditorModule = FModuleManager::GetModuleChecked<FLevelEditorModule>(TEXT("LevelEditor"));
	const TSharedPtr<FTabManager> LevelEditorTabManager = LevelEditorModule.GetLevelEditorTabManager();
	{
		// Tab已经存在了,就不需要重新生成
		const auto DockTab = LevelEditorTabManager->FindExistingLiveTab(TabName);
		if (DockTab.IsValid())
		{		
			UE_LOG(KuroEditorCommon, Display, TEXT("UReactUMGStarter tab for %s already exist"), *EditorUtilityWidgetBlueprint->GetName());
			return TabName;
		}		
	}

	// 显示标签
	UEditorUtilitySubsystem* EditorUtilitySubsystem = GEditor->GetEditorSubsystem<UEditorUtilitySubsystem>();	
	const auto Widget = EditorUtilitySubsystem->SpawnAndRegisterTabAndGetID(EditorUtilityWidgetBlueprint, TabName);
	if (Widget == nullptr)
	{
		UE_LOG(KuroEditorCommon, Error, TEXT("UReactUMGStarter spawn tab for %s failed"), *EditorUtilitySubsystem->GetName());
		return TabName;
	}

	{
		// 必须在Tab关闭时销毁JS运行时,不然在编辑器退出的时候会错
		const auto DockTab = LevelEditorTabManager->FindExistingLiveTab(TabName);
		DockTab->SetOnTabClosed(SDockTab::FOnTabClosedCallback::CreateUObject(this, &UReactUMGStarter::OnTabClosed));
	}	

	JsEnv = FKuroEditorCommonModule::GetInstance()->RunJsEnv(ModuleName, this);
	return TabName;
}

void UReactUMGStarter::SetContent(UWidget* Content)
{
	const FLevelEditorModule& LevelEditorModule = FModuleManager::GetModuleChecked<FLevelEditorModule>(TEXT("LevelEditor"));
	const TSharedPtr<FTabManager> LevelEditorTabManager = LevelEditorModule.GetLevelEditorTabManager();
	const auto DockTab = LevelEditorTabManager->FindExistingLiveTab(TabName);
	if (!DockTab.IsValid())
	{		
		UE_LOG(KuroEditorCommon, Error, TEXT("UReactUMGStarter get DockTab for %s failed"), *TabName.ToString());
		return;
	}
	
	DockTab->SetContent(Content->TakeWidget());
	// UE_LOG(KuroEditorCommon, Display, TEXT("UReactUMGStarter set content form %s to %s"), *Content->GetName(), *TabName.ToString());
}

UWorld* UReactUMGStarter::GetWorld() const
{
	return UObject::GetWorld();
}

void UReactUMGStarter::OnTabClosed(TSharedRef<SDockTab>)
{
	FKuroEditorCommonModule::GetInstance()->StopJsEnv(JsEnv);
	JsEnv = nullptr;
}
