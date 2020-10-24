import { HtmlFE } from './html-class.js'

// monaco.languages.registerDocumentFormattingEditProvider('html', {
//   provideDocumentFormattingEdits(model, options, token) {
//     return [{
//       text: HtmlFE.format(model.getValue()), // put formatted text here
//       range: model.getFullModelRange()
//     }];
//   }
// });


new HtmlFE(config)
