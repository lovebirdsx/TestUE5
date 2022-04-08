#include "MyBorder.h"

#include "KuroEditorCommon.h"

void UMyBorder::SynchronizeProperties()
{
	Super::SynchronizeProperties();
	MyBorder->SetOnMouseButtonDown(BIND_UOBJECT_DELEGATE(FPointerEventHandler, MyHandleMouseButtonDown));
	MyBorder->SetOnMouseButtonUp(BIND_UOBJECT_DELEGATE(FPointerEventHandler, MyHandleMouseButtonUp));
	MyBorder->SetOnMouseMove(BIND_UOBJECT_DELEGATE(FPointerEventHandler, MyHandleMouseMove));
}

FReply UMyBorder::MyHandleMouseButtonDown(const FGeometry& Geometry, const FPointerEvent& MouseEvent)
{
	if (OnMouseButtonDown.IsBound())
	{		
		OnMouseButtonDown.Broadcast(GenMouseEventParams(Geometry, MouseEvent));
		return FReply::Handled();
	}

	return FReply::Unhandled();
}

FReply UMyBorder::MyHandleMouseButtonUp(const FGeometry& Geometry, const FPointerEvent& MouseEvent)
{
	if (OnMouseButtonUp.IsBound())
	{
		OnMouseButtonUp.Broadcast(GenMouseEventParams(Geometry, MouseEvent));
		return FReply::Handled();
	}

	return FReply::Unhandled();
}

FReply UMyBorder::MyHandleMouseMove(const FGeometry& Geometry, const FPointerEvent& MouseEvent)
{
	if (OnMouseMove.IsBound())
	{
		OnMouseMove.Broadcast(GenMouseEventParams(Geometry, MouseEvent));
		return FReply::Handled();
	}

	return FReply::Unhandled();
}

FMouseEventParams UMyBorder::GenMouseEventParams(const FGeometry& Geometry, const FPointerEvent& MouseEvent)
{
	FMouseEventParams Params;
	const auto MousePostion = MouseEvent.GetScreenSpacePosition();
	Params.Pos = MousePostion;
	// UE_LOG(KuroEditorCommon, Warning, TEXT("%f,%f"), MousePostion.X, MousePostion.Y)
	return Params;
}