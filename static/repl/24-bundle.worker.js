self.webpackChunk([24],{37:function(n,e,r){"use strict";r.r(e),e.default='/*! *****************************************************************************\nCopyright (c) Microsoft Corporation. All rights reserved.\nLicensed under the Apache License, Version 2.0 (the "License"); you may not use\nthis file except in compliance with the License. You may obtain a copy of the\nLicense at http://www.apache.org/licenses/LICENSE-2.0\n\nTHIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY\nKIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED\nWARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,\nMERCHANTABLITY OR NON-INFRINGEMENT.\n\nSee the Apache Version 2.0 License for specific language governing permissions\nand limitations under the License.\n***************************************************************************** */\n\n\n\n/// <reference no-default-lib="true"/>\r\n\n\n/// <reference lib="es2018.asynciterable" />\r\n\r\ninterface AsyncGenerator<T = unknown, TReturn = any, TNext = unknown> extends AsyncIterator<T, TReturn, TNext> {\r\n    // NOTE: \'next\' is defined using a tuple to ensure we report the correct assignability errors in all places.\r\n    next(...args: [] | [TNext]): Promise<IteratorResult<T, TReturn>>;\r\n    return(value: TReturn | PromiseLike<TReturn>): Promise<IteratorResult<T, TReturn>>;\r\n    throw(e: any): Promise<IteratorResult<T, TReturn>>;\r\n    [Symbol.asyncIterator](): AsyncGenerator<T, TReturn, TNext>;\r\n}\r\n\r\ninterface AsyncGeneratorFunction {\r\n    /**\r\n     * Creates a new AsyncGenerator object.\r\n     * @param args A list of arguments the function accepts.\r\n     */\r\n    new (...args: any[]): AsyncGenerator;\r\n    /**\r\n     * Creates a new AsyncGenerator object.\r\n     * @param args A list of arguments the function accepts.\r\n     */\r\n    (...args: any[]): AsyncGenerator;\r\n    /**\r\n     * The length of the arguments.\r\n     */\r\n    readonly length: number;\r\n    /**\r\n     * Returns the name of the function.\r\n     */\r\n    readonly name: string;\r\n    /**\r\n     * A reference to the prototype.\r\n     */\r\n    readonly prototype: AsyncGenerator;\r\n}\r\n\r\ninterface AsyncGeneratorFunctionConstructor {\r\n    /**\r\n     * Creates a new AsyncGenerator function.\r\n     * @param args A list of arguments the function accepts.\r\n     */\r\n    new (...args: string[]): AsyncGeneratorFunction;\r\n    /**\r\n     * Creates a new AsyncGenerator function.\r\n     * @param args A list of arguments the function accepts.\r\n     */\r\n    (...args: string[]): AsyncGeneratorFunction;\r\n    /**\r\n     * The length of the arguments.\r\n     */\r\n    readonly length: number;\r\n    /**\r\n     * Returns the name of the function.\r\n     */\r\n    readonly name: string;\r\n    /**\r\n     * A reference to the prototype.\r\n     */\r\n    readonly prototype: AsyncGeneratorFunction;\r\n}\r\n'}});