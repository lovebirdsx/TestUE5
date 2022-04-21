/* eslint-disable spellcheck/spell-checker */
import {
    createEnumScheme,
    createObjectScheme,
    createStringScheme,
    FloatScheme,
} from '../../../../Common/Type';
import { ILog, IShowMessage, IWait, logLeveConfig } from '../../../../Game/Flow/Action';

export const logScheme = createObjectScheme<ILog>(
    {
        Level: createEnumScheme(logLeveConfig),
        Content: createStringScheme({
            Meta: {
                HideName: true,
                Width: 300,
                Tip: '内容',
            },
            CreateDefault: () => 'Hello World',
        }),
    },
    {
        Meta: {
            Tip: '向控制台输出消息',
        },
    },
);

export const showMssageScheme = createObjectScheme<IShowMessage>(
    {
        Content: createStringScheme({
            CreateDefault: () => 'Hello Message',
            Meta: {
                HideName: true,
                Width: 300,
                Tip: '内容',
            },
        }),
    },
    {
        Meta: {
            Tip: '在屏幕上显示消息',
        },
    },
);

class TimeScheme extends FloatScheme {
    public CreateDefault(): number {
        return 0.5;
    }

    public HideName?: boolean = true;

    public Tip?: string = '等待时长，单位秒';
}

export const waitScheme = createObjectScheme<IWait>(
    {
        Time: new TimeScheme(),
    },
    {
        Meta: {
            Tip: '等待一段时间',
        },
    },
);
