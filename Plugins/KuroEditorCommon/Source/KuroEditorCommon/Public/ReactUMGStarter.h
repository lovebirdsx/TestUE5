#pragma once

#include "CoreMinimal.h"
#include "JsEnv.h"
#include "ReactUMGStarter.generated.h"

UCLASS(BlueprintType)
class KUROEDITORCOMMON_API UReactUMGStarter : public UObject
{
	GENERATED_BODY()

public:
	UFUNCTION(BlueprintCallable, Category = "KuroEditorCommon")
	FName Start(const FString& ModuleName, class UEditorUtilityWidgetBlueprint *EditorUtilityWidgetBlueprint);

	UFUNCTION(BlueprintCallable, Category = "KuroEditorCommon")
	void SetContent(class UWidget* Content);
	
	UFUNCTION(BlueprintCallable, Category = "KuroEditorCommon")
	virtual UWorld* GetWorld() const override;

private:
	void OnTabClosed(TSharedRef<SDockTab>);

private:
	FName TabName;
	TSharedPtr<puerts::FJsEnv> JsEnv;	
};
