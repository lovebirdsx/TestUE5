#include "MyScrollBox.h"

UMyScrollBox::UMyScrollBox(const FObjectInitializer& ObjectInitializer)
	: Super(ObjectInitializer)
{
	ScrollOffset = 0;
}

void UMyScrollBox::SynchronizeProperties()
{
	if (ScrollOffset > 0)
	{
		DesiredScrollOffset = ScrollOffset;
	}
	Super::SynchronizeProperties();
	if (ScrollOffset < 0)
	{
		ScrollToEnd();
	}
}
