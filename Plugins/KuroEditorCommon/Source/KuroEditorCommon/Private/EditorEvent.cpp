#include "EditorEvent.h"

#include "KuroEditorCommon.h"
#include "LevelEditor.h"
#include "Selection.h"
#include "UnrealEdGlobals.h"
#include "Editor/TransBuffer.h"
#include "UObject/ObjectSaveContext.h"

void UEditorEvent::Initialize()
{
	USelection::SelectionChangedEvent.AddUObject(this, &UEditorEvent::OnLevelSelectionChanged);	
	FEditorDelegates::PreBeginPIE.AddUObject(this, &UEditorEvent::OnPreBeginPieOccured);
	FEditorDelegates::BeginPIE.AddUObject(this, &UEditorEvent::OnBeginPieOccured);
	FEditorDelegates::EndPIE.AddUObject(this, &UEditorEvent::OnEndPieOccured);
	FEditorDelegates::PausePIE.AddUObject(this, &UEditorEvent::OnPausePieOccured);
	FEditorDelegates::ResumePIE.AddUObject(this, &UEditorEvent::OnResumePiePieOccured);
	FEditorDelegates::PreSaveWorldWithContext.AddUObject(this, &UEditorEvent::OnPreSaveWorldWithContextOccurd);	
	FEditorDelegates::PostSaveWorldWithContext.AddUObject(this, &UEditorEvent::OnPostSaveWorldWithContextOccurd);	
	FEditorDelegates::ActorPropertiesChange.AddUObject(this, &UEditorEvent::ActorPropertiesChangeOccurd);
	FEditorDelegates::OnEditCutActorsBegin.AddUObject(this, &UEditorEvent::OnEditCutActorsBeginOccurd);
	FEditorDelegates::OnEditCutActorsEnd.AddUObject(this, &UEditorEvent::OnEditCutActorsEndOccurd);
	FEditorDelegates::OnEditCopyActorsBegin.AddUObject(this, &UEditorEvent::OnEditCopyActorsBeginOccurd);
	FEditorDelegates::OnEditCopyActorsEnd.AddUObject(this, &UEditorEvent::OnEditCopyActorsEndOccurd);
	FEditorDelegates::OnEditPasteActorsBegin.AddUObject(this, &UEditorEvent::OnEditPasteActorsBeginOccurd);
	FEditorDelegates::OnEditPasteActorsEnd.AddUObject(this, &UEditorEvent::OnEditPasteActorsEndOccurd);
	FEditorDelegates::OnDuplicateActorsBegin.AddUObject(this, &UEditorEvent::OnDuplicateActorsBeginOccurd);
	FEditorDelegates::OnDuplicateActorsEnd.AddUObject(this, &UEditorEvent::OnDuplicateActorsEndOccurd);	
	FEditorDelegates::OnNewActorsDropped.AddUObject(this, &UEditorEvent::OnNewActorsDroppedOccurd);
	FEditorDelegates::OnPackageDeleted.AddUObject(this, &UEditorEvent::OnPackageRemoveOccurd);
	FEditorDelegates::PreSaveExternalActors.AddUObject(this, &UEditorEvent::OnPreSaveExternalActorsOccurd);
	
	UE_LOG(KuroEditorCommon, Display, TEXT("UEditorEvent Initialize OK"));
}

void UEditorEvent::LaterInitialize()
{
	if (bLaterInitOk)
		return;

	if (!GEngine)
		return;
	
	GEngine->OnActorMoved().AddUObject(this, &UEditorEvent::OnActorMovedOccued);
	GEngine->OnActorsMoved().AddUObject(this, &UEditorEvent::OnActorsMovedOccued);
	GEngine->OnLevelActorAdded().AddUObject(this, &UEditorEvent::OnActorAddedOccued);
	GEngine->OnLevelActorDeleted().AddUObject(this, &UEditorEvent::OnActorDeletedOccued);

	if (GEditor != nullptr && GEditor->Trans != nullptr)
	{
		UTransBuffer* TransBuffer = CastChecked<UTransBuffer>(GEditor->Trans);
		TransBuffer->OnTransactionStateChanged().AddUObject(this, &UEditorEvent::OnTransactionStateChangedOccurd);		
	}

	FLevelEditorModule& LevelEditorModule = FModuleManager::GetModuleChecked<FLevelEditorModule>( "LevelEditor");
	LevelEditorModule.OnMapChanged().AddUObject(this, &UEditorEvent::OnMapChangedOccured);
	
	bLaterInitOk = true;
}

void UEditorEvent::LaterDeinitialize()
{
	if (!bLaterInitOk)
		return;

	if (!GEngine)
		return;

	GEngine->OnActorMoved().RemoveAll(this);
	GEngine->OnActorsMoved().RemoveAll(this);
	GEngine->OnLevelActorAdded().RemoveAll(this);
	GEngine->OnLevelActorDeleted().RemoveAll(this);

	if (GEditor != nullptr && GEditor->Trans != nullptr)
	{
		UTransBuffer* TransBuffer = CastChecked<UTransBuffer>(GEditor->Trans);
		TransBuffer->OnTransactionStateChanged().RemoveAll(this);
	}

	FLevelEditorModule& LevelEditorModule = FModuleManager::GetModuleChecked<FLevelEditorModule>( "LevelEditor");
	LevelEditorModule.OnMapChanged().RemoveAll(this);
	
	bLaterInitOk = false;
}

void UEditorEvent::Deinitialize()
{
	LaterDeinitialize();
	
	USelection::SelectionChangedEvent.RemoveAll(this);	
	FEditorDelegates::PreBeginPIE.RemoveAll(this);
	FEditorDelegates::BeginPIE.RemoveAll(this);
	FEditorDelegates::EndPIE.RemoveAll(this);
	FEditorDelegates::PausePIE.RemoveAll(this);
	FEditorDelegates::ResumePIE.RemoveAll(this);
	FEditorDelegates::PreSaveWorldWithContext.RemoveAll(this);	
	FEditorDelegates::PostSaveWorldWithContext.RemoveAll(this);	
	FEditorDelegates::ActorPropertiesChange.RemoveAll(this);
	FEditorDelegates::OnEditCutActorsBegin.RemoveAll(this);
	FEditorDelegates::OnEditCutActorsEnd.RemoveAll(this);
	FEditorDelegates::OnEditCopyActorsBegin.RemoveAll(this);
	FEditorDelegates::OnEditCopyActorsEnd.RemoveAll(this);
	FEditorDelegates::OnEditPasteActorsBegin.RemoveAll(this);
	FEditorDelegates::OnEditPasteActorsEnd.RemoveAll(this);
	FEditorDelegates::OnDuplicateActorsBegin.RemoveAll(this);
	FEditorDelegates::OnDuplicateActorsEnd.RemoveAll(this);
	FEditorDelegates::OnNewActorsDropped.RemoveAll(this);
	FEditorDelegates::OnPackageDeleted.RemoveAll(this);
	FEditorDelegates::PreSaveExternalActors.RemoveAll(this);
}

void UEditorEvent::OnLevelSelectionChanged(UObject* InObject)
{
	OnSelectionChanged.Broadcast();
}

EMapChangeTypeBP FormatMapChangeType(const EMapChangeType Type)
{
	switch (Type)
	{
	case EMapChangeType::LoadMap: return EMapChangeTypeBP::LoadMap;
	case EMapChangeType::NewMap: return EMapChangeTypeBP::NewMap;
	case EMapChangeType::SaveMap: return EMapChangeTypeBP::SaveMap;
	case EMapChangeType::TearDownWorld: return EMapChangeTypeBP::TearDownWorld;
		default: return EMapChangeTypeBP::Unkown;
	}
}

void UEditorEvent::OnMapChangedOccured(UWorld* World, EMapChangeType ChangeType)
{
	OnMapChanged.Broadcast(World, FormatMapChangeType(ChangeType));
}

void UEditorEvent::OnPreBeginPieOccured(const bool bSimulating)
{
	IsInPie = true;
	OnPreBeginPie.Broadcast(bSimulating);	
}

void UEditorEvent::OnBeginPieOccured(const bool bSimulating)
{	
	OnBeginPie.Broadcast(bSimulating);
}

void UEditorEvent::OnEndPieOccured(const bool bSimulating)
{
	IsInPie = false;
	OnEndPie.Broadcast(bSimulating);
}

void UEditorEvent::OnPausePieOccured(const bool bSimulating)
{
	OnPausePie.Broadcast(bSimulating);
}

void UEditorEvent::OnResumePiePieOccured(const bool bSimulating)
{
	OnResumePie.Broadcast(bSimulating);
}

void UEditorEvent::OnPreSaveWorldWithContextOccurd(class UWorld* World, FObjectPreSaveContext Context)
{
	OnPreSaveWorld.Broadcast();
}

void UEditorEvent::OnPostSaveWorldWithContextOccurd(UWorld* World, FObjectPostSaveContext ObjectSaveContext)
{
	OnPostSaveWorld.Broadcast();
}

void UEditorEvent::ActorPropertiesChangeOccurd() {
	ActorPropertiesChange.Broadcast();
}

void UEditorEvent::OnEditCutActorsBeginOccurd() {
	OnEditCutActorsBegin.Broadcast();
}

void UEditorEvent::OnEditCutActorsEndOccurd() {
	OnEditCutActorsEnd.Broadcast();
}

void UEditorEvent::OnEditCopyActorsBeginOccurd() {
	OnEditCopyActorsBegin.Broadcast();
}

void UEditorEvent::OnEditCopyActorsEndOccurd() {
	OnEditCopyActorsEnd.Broadcast();
}

void UEditorEvent::OnEditPasteActorsBeginOccurd() {
	OnEditPasteActorsBegin.Broadcast();
}

void UEditorEvent::OnEditPasteActorsEndOccurd() {
	OnEditPasteActorsEnd.Broadcast();
}

void UEditorEvent::OnDuplicateActorsBeginOccurd() {
	OnDuplicateActorsBegin.Broadcast();
}

void UEditorEvent::OnDuplicateActorsEndOccurd() {
	OnDuplicateActorsEnd.Broadcast();
}

void UEditorEvent::OnNewActorsDroppedOccurd(const TArray<UObject*>&, const TArray<AActor*>& Actors) {
	OnNewActorsDropped.Broadcast(Actors);
}

void UEditorEvent::OnActorMovedOccued(AActor* Actor)
{
	// 只在非Pie模式下才发送Actor添加消息, 否则会出现导致引擎奔溃的bug
	if (!IsInPie)
	{
		OnActorMoved.Broadcast(Actor);		
	}
}

void UEditorEvent::OnActorsMovedOccued(TArray<AActor*>& Actors)
{
	for (const AActor* Actor : Actors)
	{
		OnActorMoved.Broadcast(Actor);
	}
}

void UEditorEvent::OnActorAddedOccued(AActor* Actor)
{
	// 只在非Pie模式下才发送Actor添加消息, 否则会出现导致引擎奔溃的bug
	if (!IsInPie)
	{
		OnActorAdded.Broadcast(Actor);
	}
}

void UEditorEvent::OnActorDeletedOccued(AActor* Actor)
{
	// 只在非Pie模式下才发送Actor添加消息, 否则会出现导致引擎奔溃的bug
	if (!IsInPie)
	{
		OnActorDeleted.Broadcast(Actor);
	}
}

void UEditorEvent::OnPackageRemoveOccurd(UPackage* Package)
{
	OnPackageRemoved.Broadcast(Package);
}

void UEditorEvent::OnPreSaveExternalActorsOccurd(UWorld* World)
{
	OnPreSaveExternalActors.Broadcast(World);
}

ETransactionStateEventTypeBP FormatTransactionStateEventType(const ETransactionStateEventType Type)
{
	switch (Type)
	{
	case ETransactionStateEventType::TransactionStarted: return ETransactionStateEventTypeBP::TransactionStarted;
	case ETransactionStateEventType::TransactionCanceled: return ETransactionStateEventTypeBP::TransactionCanceled;
	case ETransactionStateEventType::TransactionFinalized: return ETransactionStateEventTypeBP::TransactionFinalized;
	case ETransactionStateEventType::UndoRedoStarted: return ETransactionStateEventTypeBP::UndoRedoStarted;
	case ETransactionStateEventType::UndoRedoFinalized: return ETransactionStateEventTypeBP::UndoRedoFinalized;
		default: return ETransactionStateEventTypeBP::Unknown;
	}
}

void UEditorEvent::OnTransactionStateChangedOccurd(const FTransactionContext& InTransactionContext,
	const ETransactionStateEventType InTransactionState)
{	
	OnTransactionStateChanged.Broadcast(InTransactionContext.Title.ToString(), InTransactionContext.TransactionId, FormatTransactionStateEventType(InTransactionState));
}
