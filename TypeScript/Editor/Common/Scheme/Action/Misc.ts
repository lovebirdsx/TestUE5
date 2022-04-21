/* eslint-disable spellcheck/spell-checker */
import {
    createObjectScheme,
    createStringScheme,
    EnumScheme,
    FloatScheme,
    ObjectScheme,
    StringScheme,
    TObjectFields,
} from '../../../../Common/Type';
import { getEnumNamesByConfig } from '../../../../Common/Util';
import { ILog, IShowMessage, IWait, logLeveConfig, TLogLevel } from '../../../../Game/Flow/Action';

export class LogLevelScheme extends EnumScheme<TLogLevel> {
    public Config: Record<string, string> = logLeveConfig;

    public Names: string[] = getEnumNamesByConfig(logLeveConfig);
}

const DEFAULT_CONTENT_LEN = 300;

export class ContentScheme extends StringScheme {
    public CreateDefault(): string {
        return 'Hello World';
    }

    public HideName?: boolean = true;

    public Width?: number = DEFAULT_CONTENT_LEN;

    public Tip?: string = '内容';
}

export class LogScheme extends ObjectScheme<ILog> {
    public Fields: TObjectFields<ILog> = {
        Level: new LogLevelScheme(),
        Content: new ContentScheme(),
    };

    public Tip?: string = '向控制台输出消息';
}

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
