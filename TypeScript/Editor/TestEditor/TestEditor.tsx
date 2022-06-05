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
import { ESlateSizeRule, ReactUMGStarter } from 'ue';

import { log } from '../../Common/Log';
import { getTestErrorRecords } from '../../Common/Test';
import testContainer from '../../Editor/UnitTest/Engine/TestContainer';
import testFile from '../../Editor/UnitTest/Engine/TestFile';
import testImmer from '../../Editor/UnitTest/TestImmer';
import testTalkListTool from '../../Editor/UnitTest/TestTalkListTool';
import testTextListCsv, {
    readTextListCsv,
    writeTextListCsv,
} from '../../Editor/UnitTest/TestTextListCsv';
import { ReactUMG } from '../../react-umg/react-umg';
import { Btn, H3, H3_SIZE, Text } from '../Common/BaseComponent/CommonComponent';
import { LevelTools } from '../EntityEditor/LevelTools';
import testConfig from '../UnitTest/Common/TestConfig';
import { testUtil } from '../UnitTest/Engine/TestUtil';
import testClass from '../UnitTest/Game/TestClass';
import testIdAllocator from '../UnitTest/Game/TestIdAllocator';
import testTickManager from '../UnitTest/Game/TestTickManager';
import testCsvParser from '../UnitTest/TestCsvParser';
import testEntityScheme from '../UnitTest/TestEntityScheme';
import testEvent from '../UnitTest/TestEvent';
import { testOpenFileDialog, testSaveFileDialog } from './FileDialog';
import { TestAssetSelector } from './TestAssetSelector';
import { TestButton } from './TestButton';
import { TestContextBtn } from './TestContextBtn';
// import { TestCsvView } from './TestCsvView';
import { TestListView } from './TestListView';
import { TestMap } from './TestMap';
import { TestMoveComponent } from './TestMoveComponent';

interface ITest {
    Name: string;
    ManualRun?: boolean;
    Fun: () => void;
}

interface ITestEditorState {
    Tests: ITest[];
}

function fixEntityIds(): void {
    LevelTools.FixAllEntityDataId();
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
    { Name: 'testTickManager', Fun: testTickManager },
    { Name: 'testEntityScheme', Fun: testEntityScheme },
    { Name: 'testCsvParser', Fun: testCsvParser },
    { Name: 'testTalkListTool', Fun: testTalkListTool },
    { Name: 'testTextListCSV', Fun: testTextListCsv },
    { Name: 'testOpenFileDialog', Fun: testOpenFileDialog, ManualRun: true },
    { Name: 'testCloseFileDialog', Fun: testSaveFileDialog, ManualRun: true },
    { Name: 'fixEntityIds', Fun: fixEntityIds, ManualRun: true },
];

export class TestEditor extends React.Component<unknown, ITestEditorState> {
    public constructor(props: unknown) {
        super(props);
        this.state = {
            Tests: allTests,
        };
    }

    private RenderTest(): JSX.Element {
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

    private RenderTests(): JSX.Element {
        return (
            <VerticalBox>
                {this.RenderUnitTestResults()}
                <H3 Text={'Test Logic'} />
                {this.RenderTest()}
                <H3 Text={'Test Map'} />
                <TestMap />
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
