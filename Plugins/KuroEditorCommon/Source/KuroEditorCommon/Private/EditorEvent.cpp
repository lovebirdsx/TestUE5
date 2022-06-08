#include "EditorEvent.h"

#include "KuroEditorCommon.h"
#include "Selection.h"
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
	FEditorDelegates::ActorPropertiesChange.AddUObject(this, &UEditorEvent::ActorPropertiesChangeOccurd);
	FEditorDelegates::OnEditCutActorsBegin.AddUObject(this, &UEditorEvent::OnEditCutActorsBeginOccurd);
	FEditorDelegates::OnEditCutActorsEnd.AddUObject(this, &UEditorEvent::OnEditCutActorsEndOccurd);
	FEditorDelegates::OnEditCopyActorsBegin.AddUObject(this, &UEditorEvent::OnEditCopyActorsBeginOccurd);
	FEditorDelegates::OnEditCopyActorsEnd.AddUObject(this, &UEditorEvent::OnEditCopyActorsEndOccurd);
	FEditorDelegates::OnEditPasteActorsBegin.AddUObject(this, &UEditorEvent::OnEditPasteActorsBeginOccurd);
	FEditorDelegates::OnEditPasteActorsEnd.AddUObject(this, &UEditorEvent::OnEditPasteActorsEndOccurd);
	FEditorDelegates::OnDuplicateActorsBegin.AddUObject(this, &UEditorEvent::OnDuplicateActorsBeginOccurd);
	FEditorDelegates::OnDuplicateActorsEnd.AddUObject(this, &UEditorEvent::OnDuplicateActorsEndOccurd);
	FEditorDelegates::OnDeleteActorsBegin.AddUObject(this, &UEditorEvent::OnDeleteActorsBeginOccurd);
	FEditorDelegates::OnDeleteActorsEnd.AddUObject(this, &UEditorEvent::OnDeleteActorsEndOccurd);
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
	GEngine->OnLevelActorAdded().AddUObject(this, &UEditorEvent::OnActorAddedOccued);
	GEngine->OnLevelActorDeleted().AddUObject(this, &UEditorEvent::OnActorDeletedOccued);
	bLaterInitOk = true;
}

void UEditorEvent::LaterDeinitialize()
{
	if (!bLaterInitOk)
		return;

	if (!GEngine)
		return;

	GEngine->OnActorMoved().RemoveAll(this);
	GEngine->OnLevelActorAdded().RemoveAll(this);
	GEngine->OnLevelActorDeleted().RemoveAll(this);
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
	FEditorDelegates::ActorPropertiesChange.RemoveAll(this);
	FEditorDelegates::OnEditCutActorsBegin.RemoveAll(this);
	FEditorDelegates::OnEditCutActorsEnd.RemoveAll(this);
	FEditorDelegates::OnEditCopyActorsBegin.RemoveAll(this);
	FEditorDelegates::OnEditCopyActorsEnd.RemoveAll(this);
	FEditorDelegates::OnEditPasteActorsBegin.RemoveAll(this);
	FEditorDelegates::OnEditPasteActorsEnd.RemoveAll(this);
	FEditorDelegates::OnDuplicateActorsBegin.RemoveAll(this);
	FEditorDelegates::OnDuplicateActorsEnd.RemoveAll(this);
	FEditorDelegates::OnDeleteActorsBegin.RemoveAll(this);
	FEditorDelegates::OnDeleteActorsEnd.RemoveAll(this);
	FEditorDelegates::OnNewActorsDropped.RemoveAll(this);
	FEditorDelegates::OnPackageDeleted.RemoveAll(this);
	FEditorDelegates::PreSaveExternalActors.RemoveAll(this);
}

void UEditorEvent::OnLevelSelectionChanged(UObject* InObject)
{
	OnSelectionChanged.Broadcast();
}

void UEditorEvent::OnPreBeginPieOccured(const bool bSimulating)
{
	OnPreBeginPie.Broadcast(bSimulating);	
}

void UEditorEvent::OnBeginPieOccured(const bool bSimulating)
{
	OnBeginPie.Broadcast(bSimulating);
}

void UEditorEvent::OnEndPieOccured(const bool bSimulating)
{
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

void UEditorEvent::OnDeleteActorsBeginOccurd() {
	OnDeleteActorsBegin.Broadcast();
}

void UEditorEvent::OnDeleteActorsEndOccurd() {
	OnDeleteActorsEnd.Broadcast();
}

void UEditorEvent::OnNewActorsDroppedOccurd(const TArray<UObject*>&, const TArray<AActor*>& Actors) {
	OnNewActorsDropped.Broadcast(Actors);
}

void UEditorEvent::OnActorMovedOccued(AActor* Actor)
{
	OnActorMoved.Broadcast(Actor);
}

void UEditorEvent::OnActorAddedOccued(AActor* Actor)
{
	OnActorAdded.Broadcast(Actor);
}

void UEditorEvent::OnActorDeletedOccued(AActor* Actor)
{
	OnActorDeleted.Broadcast(Actor);
}

void UEditorEvent::OnPackageRemoveOccurd(UPackage* Package)
{
	OnPackageRemoved.Broadcast(Package);
}

void UEditorEvent::OnPreSaveExternalActorsOccurd(UWorld* World)
{
	OnPreSaveExternalActors.Broadcast(World);
}
