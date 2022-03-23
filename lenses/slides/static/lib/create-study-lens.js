export const createStudyLens = ({
  code = '',
  lang = '.txt',
  lenses = ['study'],
}) => {
  if (lenses.length === 0) {
    lenses.push('study');
  }
  const studyLens = new StudyLens(code, lang);
  studyLens.setAttribute('lenses', lenses.join(' '));
  studyLens.setAttribute('class', 'lens');
  return studyLens;
};
