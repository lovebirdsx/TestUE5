/* eslint-disable spellcheck/spell-checker */
import {
    createEnumType,
    createFloatScheme,
    createObjectScheme,
    createStringScheme,
    IAbstractType,
} from '../../../../Common/Type';
import { ILog, IShowMessage, IWait, logLeveConfig, TLogLevel } from '../../../../Game/Flow/Action';

export const logScheme = createObjectScheme<ILog>(
    {
        Level: createEnumType(logLeveConfig, {
            Meta: {
                HideName: true,
            },
        }) as IAbstractType<TLogLevel>,
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

export const waitScheme = createObjectScheme<IWait>(
    {
        Time: createFloatScheme({
            CreateDefault: () => 0.5,
            Meta: {
                HideName: true,
                Tip: '等待时长，单位秒',
            },
        }),
    },
    {
        Meta: {
            Tip: '等待一段时间',
        },
    },
);
