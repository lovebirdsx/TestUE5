/* eslint-disable spellcheck/spell-checker */
// import * as fs from 'fs';
import * as UE from 'ue';

import { FnvHash } from './FowlerNollVoHash';

// import { Log } from '../../Core/Common/Log';
// import { ELogAuthor } from '../../Core/Define/LogDefine';

const TAB = '    ';

const reg = new RegExp(/^\d/);

class TagNode {
    public NodeName: string;

    public TagName: string;

    public Children = new Map<string, TagNode>();

    public Depth: number;

    public AddNode(node: string): void {
        const sections = node.split('.');
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let cur: TagNode = this;
        const curTagName = new Array<string>();
        for (const [depth, i] of sections.entries()) {
            curTagName.push(i);
            if (cur.Children.has(i)) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                cur = cur.Children.get(i);
            } else {
                const newNode = new TagNode();
                newNode.NodeName = i;
                newNode.TagName = curTagName.join('.');
                newNode.Depth = depth + 1;
                cur.Children.set(i, newNode);
                cur = newNode;
            }
        }
    }

    private GetRegulizedName(name: string): string {
        if (reg.test(name)) {
            return "'" + name + "'";
        }
        return name;
    }

    public PreOrder(): string {
        let s = '';
        if (this.TagName) {
            s =
                TAB.repeat(this.Depth) +
                this.GetRegulizedName(this.NodeName + 'Tag') +
                ": new UE.GameplayTag('" +
                this.TagName +
                "'),\r\n";
            if (this.Children.size > 0) {
                s = s + TAB.repeat(this.Depth) + this.GetRegulizedName(this.NodeName) + ': {\r\n';
                for (const [, value] of this.Children) {
                    s = s + value.PreOrder();
                }
                s = s + TAB.repeat(this.Depth) + '},\r\n';
            }
        } else {
            for (const [, value] of this.Children) {
                s = s + value.PreOrder();
            }
        }
        return s;
    }
}

class GameplayTagDefineGenerator extends UE.EditorUtilityObject {
    public GenerateFile(allTags: UE.GameplayTagContainer): string {
        let prefix = `/* eslint-disable @typescript-eslint/no-magic-numbers */\r\n/* eslint-disable @typescript-eslint/naming-convention */\r\n/* eslint-disable spellcheck/spell-checker */\r\n`;
        prefix = prefix + "import * as UE from 'ue';\r\n";
        const tagDefines = prefix + this.GenerateTags(allTags);
        const tagIdDefines = this.GenerateIds(allTags);
        const tagMap = this.GenerateMap(allTags);
        const output = tagDefines + tagIdDefines + tagMap;
        return output;
    }

    // @no-blueprint
    private GenerateTags(allTags: UE.GameplayTagContainer): string {
        const tagArray = allTags.GameplayTags;
        const root = new TagNode();
        const size = tagArray.Num();
        for (let i = 0; i < size; i++) {
            const tag = tagArray.Get(i);
            root.AddNode(tag.TagName);
        }
        const tagDefines = 'export const gameplayTag = {\r\n' + root.PreOrder() + '};\r\n';
        return tagDefines;
    }

    // @no-blueprint
    private GenerateIds(allTags: UE.GameplayTagContainer): string {
        let s = 'export const TagId = {\r\n';
        for (let i = 0; i < allTags.GameplayTags.Num(); i++) {
            const tag = allTags.GameplayTags.Get(i);
            // eslint-disable-next-line spellcheck/spell-checker
            s += TAB + `'${tag.TagName}': ${FnvHash.FnvHash32(tag.TagName)},\r\n`;
        }
        return s + '};\r\n';
    }

    // @no-blueprint
    private GenerateMap(allTags: UE.GameplayTagContainer): string {
        let s = 'export const tagMap = new Map([\r\n';
        for (let i = 0; i < allTags.GameplayTags.Num(); i++) {
            const tag = allTags.GameplayTags.Get(i);
            // eslint-disable-next-line spellcheck/spell-checker
            s +=
                TAB +
                `[${FnvHash.FnvHash32(tag.TagName)}, new UE.GameplayTag('${tag.TagName}')],\r\n`;
        }
        return s + ']);\r\n';
    }
}
export default GameplayTagDefineGenerator;
