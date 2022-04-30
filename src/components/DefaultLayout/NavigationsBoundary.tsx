import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { PRACTICE_SECTION, VOCABULARY_SECTION, PHRASES_SECTION } from '../../utils/constants';
import PracticeSection from './practice/PracticeSection';
import VocabularySection from './vocabulary/VocabularySection';
import PhrasesSection from './phrases/PhrasesSection';

class NavigationsBoundary extends React.Component<any, any> {
  renderSection() {
    const { sectionId } = this.props.match.params;
    switch (sectionId) {
      case PRACTICE_SECTION.toLowerCase():
        return <PracticeSection />;
      case VOCABULARY_SECTION.toLowerCase():
        return <VocabularySection />;
      case PHRASES_SECTION.toLowerCase():
        return <PhrasesSection />;
      default:
        return <PracticeSection />;
    }
  }
  render() {
    return this.renderSection();
  }
}

export default withRouter(NavigationsBoundary);
