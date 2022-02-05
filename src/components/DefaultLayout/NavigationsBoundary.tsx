import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { PRACTICE_SECTION, PROGRESS_SECTION, VOCABULARY_SECTION } from '../../utils/constants';
import ProgressSection from './ProgressSection';
import PracticeSection from './practice/PracticeSection';
import VocabularySection from './vocabulary/VocabularySection';

class NavigationsBoundary extends React.Component<any, any> {
	renderSection() {
		const { sectionId } = this.props.match.params;
		switch (sectionId) {
			case PROGRESS_SECTION.toLowerCase():
				return <ProgressSection />;
			case PRACTICE_SECTION.toLowerCase():
				return <PracticeSection />;
			case VOCABULARY_SECTION.toLowerCase():
				return <VocabularySection />;
			default:
				return <ProgressSection />;
		}
	}
	render() {
		return this.renderSection();
	}
}

export default withRouter(NavigationsBoundary);
