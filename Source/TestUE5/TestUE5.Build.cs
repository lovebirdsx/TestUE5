// Copyright Epic Games, Inc. All Rights Reserved.

using UnrealBuildTool;

public class TestUE5 : ModuleRules
{
	public TestUE5(ReadOnlyTargetRules Target) : base(Target)
	{
		PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;

		PublicDependencyModuleNames.AddRange(new string[] { "Core", "CoreUObject", "Engine", "InputCore", "HeadMountedDisplay" });
	}
}
