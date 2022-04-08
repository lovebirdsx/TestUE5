#pragma once

#include "CoreMinimal.h"
#include "Blueprint/UserWidget.h"
#include "UMGRoot.generated.h"

UCLASS()
class KUROEDITORCOMMON_API UUMGRoot : public UUserWidget
{
	GENERATED_BODY()
public:
	DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FUMGKeyEvent, FString, Key);
	DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FUMGTickEvent, float, DeltaTime);
	DECLARE_DYNAMIC_MULTICAST_DELEGATE(FUMGEvent);
	
	explicit UUMGRoot(const FObjectInitializer& ObjectInitializer);

	UFUNCTION(BlueprintCallable, BlueprintCosmetic, Category = "KuroEditorCommon")
	static UUMGRoot* CreateUmgRoot(UWorld* World);

	UFUNCTION(BlueprintCallable, Category = "KuroEditorCommon")
	UPanelSlot* AddChild(UWidget* Content);

	UFUNCTION(BlueprintCallable, Category = "KuroEditorCommon")
	bool RemoveChild(UWidget* Content);	

	UPROPERTY(EditAnywhere, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FUMGKeyEvent OnUMGKeyDown;

	UPROPERTY(EditAnywhere, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FUMGKeyEvent OnUMGKeyUp;	
	
	UPROPERTY(EditAnywhere, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FUMGTickEvent OnUMGTick;
	
	UPROPERTY(EditAnywhere, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FUMGEvent OnUMGFocusGet;
	
	UPROPERTY(EditAnywhere, Category="KuroEditorCommon", meta=( IsBindableEvent="True" ))
	FUMGEvent OnUMGFocusLost;
	
protected:
	virtual FReply NativeOnKeyDown( const FGeometry& InGeometry, const FKeyEvent& InKeyEvent ) override;
	virtual FReply NativeOnKeyUp( const FGeometry& InGeometry, const FKeyEvent& InKeyEvent ) override;
	virtual void NativeTick(const FGeometry& MyGeometry, float InDeltaTime) override;
	virtual FReply NativeOnFocusReceived( const FGeometry& InGeometry, const FFocusEvent& InFocusEvent ) override;
	virtual void NativeOnFocusLost( const FFocusEvent& InFocusEvent ) override;
	
	UPanelSlot* RootSlot;
};