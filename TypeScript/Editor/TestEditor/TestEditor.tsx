/* eslint-disable spellcheck/spell-checker */

import * as React from 'react';
import {
    GridPanel,
    GridSlot,
    HorizontalBox,
    ScrollBox,
    VerticalBox,
    VerticalBoxSlot,
} from 'react-umg';
import { Blueprint, Character, Class, EditorOperations, ESlateSizeRule, ReactUMGStarter } from 'ue';

import { error, log, warn } from '../../Common/Misc/Log';
import { getTestErrorRecords } from '../../Common/Misc/Test';
import testContainer from '../../Editor/UnitTest/Engine/TestContainer';
import testFile from '../../Editor/UnitTest/Engine/TestFile';
import testImmer from '../../Editor/UnitTest/TestImmer';
import testTalkListTool from '../../Editor/UnitTest/TestTalkListTool';
import testTextListCsv, {
    readTextListCsv,
    writeTextListCsv,
} from '../../Editor/UnitTest/TestTextListCsv';
import { ReactUMG } from '../../react-umg/react-umg';
import { assetListCache } from '../Common/AssetListCache';
import { Btn, H3, H3_SIZE, Text } from '../Common/BaseComponent/CommonComponent';
import { ErrorBoundary } from '../Common/BaseComponent/ErrorBoundary';
import { configExporter } from '../Common/ConfigExporter';
import { LevelTools } from '../EntityEditor/LevelTools';
import testConfig from '../UnitTest/Common/TestConfig';
import { testUtil } from '../UnitTest/Engine/TestUtil';
import testClass from '../UnitTest/Game/TestClass';
import testIdAllocator from '../UnitTest/Game/TestIdAllocator';
import testCsvParser from '../UnitTest/TestCsvParser';
import testEntityScheme from '../UnitTest/TestEntityScheme';
import testEvent from '../UnitTest/TestEvent';
import { testOpenFileDialog, testSaveFileDialog } from './FileDialog';
import { TestAssetSelector } from './TestAssetSelector';
import { TestButton } from './TestButton';
import { TestContextBtn } from './TestContextBtn';
import { TestLevel } from './TestLevel';
// import { TestCsvView } from './TestCsvView';
import { TestListView } from './TestListView';
import { TestMoveComponent } from './TestMoveComponent';

interface ITest {
    Name: string;
    ManualRun?: boolean;
    Fun: () => void;
}

interface ITestEditorState {
    Tests: ITest[];
}

function fixEntities(): void {
    LevelTools.FixAllEntityData();
}

function fixFlowLists(): void {
    LevelTools.FixAllFlowList();
}

function fixEntityTemplates(): void {
    LevelTools.FixAllEntityTempalte();
}

function outputClassName(): void {
    const classObj = Class.Load(
        `Blueprint'/Game/Blueprints/TypeScript/Game/Entity/TsEntity.TsEntity_C'`,
    );
    log(`TsEntity class name = ${classObj.GetName()}`);
}

function getAssetList(): void {
    const searchPath = '/Game/Blueprints';
    const searchClass = 'Blueprint';
    const assertList = assetListCache.GetAssets(searchPath, searchClass);
    log(`searchPath: ${searchPath} searchClass: ${searchClass} count: ${assertList.length}`);
    assertList.forEach((a) => {
        log(`Name: ${a.AssetName} AssetClass: ${a.AssetClass} ObjectPath: ${a.ObjectPath}`);
    });
}

function getDefaultObject(): void {
    const bp = Blueprint.Load('/Game/Blueprints/ExtendedEntity/Dynamic/BP_AiNpcAj.BP_AiNpcAj');
    log(bp.GetName());
    const character = EditorOperations.GetDefaultObject(bp.GeneratedClass) as Character;
    log(`Name = ${character.GetName()}`);
    const mesh = character.Mesh;
    log(`SkeletalMesh = ${mesh.SkeletalMesh.GetName()}`);
    log(`AnimClass = ${mesh.AnimClass.GetName()}`);
    for (let i = 0; i < mesh.GetNumMaterials(); i++) {
        log(`Material ${i} = ${mesh.GetMaterial(i).GetName()}`);
    }
}

function exportConfig(): void {
    configExporter.Export();
}

function testLog(): void {
    log('this is log');
    warn('this is warn');
    error('this is error');
}

const allTests: ITest[] = [
    { Name: 'testUtil', Fun: testUtil },
    { Name: 'testConfig', Fun: testConfig },
    { Name: 'testIdAllocator', Fun: testIdAllocator },
    { Name: 'testEvent', Fun: testEvent },
    { Name: 'testContainer', Fun: testContainer },
    { Name: 'testImmer', Fun: testImmer },
    { Name: 'testFile', Fun: testFile },
    { Name: 'testClass', Fun: testClass },
    { Name: 'testEntityScheme', Fun: testEntityScheme },
    { Name: 'testCsvParser', Fun: testCsvParser },
    { Name: 'testTalkListTool', Fun: testTalkListTool },
    { Name: 'testTextListCSV', Fun: testTextListCsv },
    { Name: 'testOpenFileDialog', Fun: testOpenFileDialog, ManualRun: true },
    { Name: 'testCloseFileDialog', Fun: testSaveFileDialog, ManualRun: true },
    { Name: 'fixEntities', Fun: fixEntities, ManualRun: true },
    { Name: 'fixFlowLists', Fun: fixFlowLists, ManualRun: true },
    { Name: 'fixEntityTemplates', Fun: fixEntityTemplates, ManualRun: true },
    { Name: 'outputClassName', Fun: outputClassName, ManualRun: true },
    { Name: 'getAssetList', Fun: getAssetList, ManualRun: true },
    { Name: 'getDefaultObject', Fun: getDefaultObject, ManualRun: true },
    { Name: 'exportConfig', Fun: exportConfig, ManualRun: true },
    { Name: 'testLog', Fun: testLog, ManualRun: true },
];

export class TestEditor extends React.Component<unknown, ITestEditorState> {
    public constructor(props: unknown) {
        super(props);
        this.state = {
            Tests: allTests,
        };
    }

    private RenderTestButtons(): JSX.Element {
        const row = 4;
        const testElements = this.state.Tests.map((test, id) => {
            const slot: GridSlot = {
                Row: Math.floor(id / row),
                Column: id % row,
                Padding: {
                    Left: 1,
                    Right: 1,
                    Top: 1,
                    Bottom: 1,
                },
            };
            return (
                <Btn
                    Slot={slot}
                    key={test.Name}
                    Text={test.Name}
                    OnClick={(): void => {
                        test.Fun();
                    }}
                />
            );
        });

        return <GridPanel>{testElements}</GridPanel>;
    }

    private RenderReadWriteCsv(): JSX.Element {
        return (
            <HorizontalBox>
                <Btn
                    Text="write EditorTest/textList.csv"
                    OnClick={(): void => {
                        writeTextListCsv('EditorTest/textList.csv');
                    }}
                />
                <Btn
                    Text="read EditorTest/textList2.csv"
                    OnClick={(): void => {
                        readTextListCsv('EditorTest/textList2.csv');
                    }}
                />
            </HorizontalBox>
        );
    }

    private RenderUiTests(): JSX.Element {
        return (
            <VerticalBox>
                <H3 Text={'Test Level'} />
                <TestLevel />
                <H3 Text={'Test Button enabled'} />
                <TestButton />
                <H3 Text={'Test MoveComponent'} />
                <TestMoveComponent />
                <H3 Text={'Test ListView'} />
                <TestListView />
                <H3 Text={'Test ContextBtn'} />
                <TestContextBtn />
                <H3 Text={'Test AssetSelector'} />
                <TestAssetSelector />
                <H3 Text={'Read/Write Csv'} />
                {this.RenderReadWriteCsv()}
                {/* <H3 Text={'Test Csv View'} />
                <TestCsvView /> */}
            </VerticalBox>
        );
    }

    private RenderTests(): JSX.Element {
        return (
            <VerticalBox>
                {this.RenderUnitTestResults()}
                {this.RenderTestButtons()}
                <ErrorBoundary>{this.RenderUiTests()}</ErrorBoundary>
            </VerticalBox>
        );
    }

    private RenderErrors(): JSX.Element {
        const errors = getTestErrorRecords();
        if (errors.length <= 0) {
            return (
                <Text
                    Text={'Congratulations! All test passed :)'}
                    Color={'#008000 green'}
                    Size={H3_SIZE}
                />
            );
        }

        const errorElements = errors.map((err, id) => {
            return (
                <VerticalBox key={id}>
                    <Text Text={`[${err.TestName}]`} Color={'#CD5C5C indian red'} Size={H3_SIZE} />
                    <Text Text={err.Error.stack} />
                </VerticalBox>
            );
        });
        return <VerticalBox>{errorElements}</VerticalBox>;
    }

    private RenderUnitTestResults(): JSX.Element {
        return (
            <VerticalBox>
                <H3 Text={`Test result`} />
                {this.RenderErrors()}
            </VerticalBox>
        );
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const scrollBoxSlot: VerticalBoxSlot = {
            Size: { SizeRule: ESlateSizeRule.Fill },
        };

        return (
            <VerticalBox>
                <ScrollBox Slot={scrollBoxSlot}>{this.RenderTests()}</ScrollBox>
            </VerticalBox>
        );
    }
}

function testAll(): void {
    allTests.forEach((test) => {
        if (!test.ManualRun) {
            log(`${test.Name} ==================`);
            test.Fun();
        }
    });
}

export function runTestEditor(starter: ReactUMGStarter): void {
    testAll();
    ReactUMG.init(starter);
    ReactUMG.render(<TestEditor />);
}
