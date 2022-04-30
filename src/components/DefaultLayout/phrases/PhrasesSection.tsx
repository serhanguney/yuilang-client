import { InfoContainer, MainSection, SectionContainer } from '../../../design/components/containers';
import { YuiTitle, YuiTitleLine } from '../../../design/components/YuiTitle';
import * as React from 'react';
import { connect } from 'react-redux';
import UserInput from '../../../design/components/Input';
import { useEffect, useState } from 'react';
import { RootState } from '../../../redux/reducer';
import { ReducerState } from '../../../redux/content';
import { PhraseType } from '../../../conf/dataModel';
import { ActionButton } from '../../../design/components/buttons';
import InfoLine from '../../../design/components/InfoLine';

type SectionProps = Pick<ReducerState, 'userContent'>;

const PhrasesSection = ({ userContent }: SectionProps) => {
  const [searchedValue, setSearchedValue] = useState<{ phrase: string }>({ phrase: '' });

  let allPhrases: PhraseType = {};
  if ('categories' in userContent) {
    allPhrases = Object.values(userContent.categories).reduce((acc, { phrases }) => {
      acc = { ...acc, ...phrases };
      return acc;
    }, {});
  }

  const [phraseList, setPhraseList] = useState<PhraseType>(allPhrases);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchedValue({ ...searchedValue, phrase: e.target.value });
  }
  function renderPhraseList(phrases: PhraseType) {
    const arrayOfPhrases = Object.entries(phrases);

    return arrayOfPhrases.map(([id, phrase]) => (
      <InfoLine heading={phrase.inEnglish} description={phrase.phrase}>
        <ActionButton appearance={'cancel'} data-id={id}>
          -
        </ActionButton>
      </InfoLine>
    ));
  }

  useEffect(() => {
    if (searchedValue.phrase.length > 2) {
      for (const id in phraseList) {
        const phrase = phraseList[id];
        if (phrase.inEnglish.includes(searchedValue.phrase)) {
          setPhraseList({ [id]: phrase });
        }
      }
    } else {
      setPhraseList(allPhrases);
    }
  }, [searchedValue]);
  return (
    <MainSection style={{ maxHeight: '75%' }}>
      <SectionContainer flex={false}>
        <YuiTitle>
          <p>Phrases</p>
          <YuiTitleLine />
        </YuiTitle>
        <UserInput
          value={searchedValue.phrase}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e)}
          name={'search phrase'}
          aria-label={'search'}
        />
      </SectionContainer>
      <SectionContainer style={{ margin: '0' }} scroll>
        {renderPhraseList(phraseList)}
      </SectionContainer>
    </MainSection>
  );
};

const mapStateToProps = (state: RootState) => ({
  userContent: state.content.userContent,
});
export default connect(mapStateToProps)(PhrasesSection);
