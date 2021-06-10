self.webpackChunk([28],{41:function(n,e,r){"use strict";r.r(e),e.default='/*! *****************************************************************************\nCopyright (c) Microsoft Corporation. All rights reserved.\nLicensed under the Apache License, Version 2.0 (the "License"); you may not use\nthis file except in compliance with the License. You may obtain a copy of the\nLicense at http://www.apache.org/licenses/LICENSE-2.0\n\nTHIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY\nKIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED\nWARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,\nMERCHANTABLITY OR NON-INFRINGEMENT.\n\nSee the Apache Version 2.0 License for specific language governing permissions\nand limitations under the License.\n***************************************************************************** */\n\n\n\n/// <reference no-default-lib="true"/>\r\n\n\ndeclare namespace Intl {\r\n\r\n    // http://cldr.unicode.org/index/cldr-spec/plural-rules#TOC-Determining-Plural-Categories\r\n    type LDMLPluralRule = "zero" | "one" | "two" | "few" | "many" | "other";\r\n    type PluralRuleType = "cardinal" | "ordinal";\r\n\r\n    interface PluralRulesOptions {\r\n        localeMatcher?: "lookup" | "best fit";\r\n        type?: PluralRuleType;\r\n        minimumIntegerDigits?: number;\r\n        minimumFractionDigits?: number;\r\n        maximumFractionDigits?: number;\r\n        minimumSignificantDigits?: number;\r\n        maximumSignificantDigits?: number;\r\n    }\r\n\r\n    interface ResolvedPluralRulesOptions {\r\n        locale: string;\r\n        pluralCategories: LDMLPluralRule[];\r\n        type: PluralRuleType;\r\n        minimumIntegerDigits: number;\r\n        minimumFractionDigits: number;\r\n        maximumFractionDigits: number;\r\n        minimumSignificantDigits?: number;\r\n        maximumSignificantDigits?: number;\r\n    }\r\n\r\n    interface PluralRules {\r\n        resolvedOptions(): ResolvedPluralRulesOptions;\r\n        select(n: number): LDMLPluralRule;\r\n    }\r\n\r\n    const PluralRules: {\r\n        new (locales?: string | string[], options?: PluralRulesOptions): PluralRules;\r\n        (locales?: string | string[], options?: PluralRulesOptions): PluralRules;\r\n        supportedLocalesOf(\r\n            locales: string | string[],\r\n            options?: PluralRulesOptions,\r\n        ): string[];\r\n    };\r\n}\r\n'}});