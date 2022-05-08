import { MainSection, SectionContainer } from '../../../design/components/containers';
import { YuiTitle, YuiTitleLine } from '../../../design/components/YuiTitle';
import * as React from 'react';
import { connect } from 'react-redux';
import UserInput from '../../../design/components/Input';
import { useEffect, useState } from 'react';
import { RootState } from '../../../redux/reducer';
import { ReducerState as ContentState } from '../../../redux/content';
import { PhraseModel } from '../../../conf/dataModel';
import { ActionButton } from '../../../design/components/buttons';
import InfoLine from '../../../design/components/InfoLine';
import { DeleteRequestProps, initialiseDeleteRequest } from '../../../redux/firebase';
import { Identity } from '../../../redux/identity';
import CloseIcon from '../../../icons/close_icon';
import closeIcon from '../../../icons/close_icon.svg';

type SectionProps = Pick<ContentState, 'userContent'> & {
  initialiseDeleteRequest: (ctx: DeleteRequestProps) => void;
} & Identity;

type PhraseListTypes = { [uuid: string]: PhraseModel & { category: string } };
const PhrasesSection = ({ uid, userContent, initialiseDeleteRequest, ...rest }: SectionProps) => {
  const [searchedValue, setSearchedValue] = useState<{ phrase: string }>({ phrase: '' });

  let allPhrases: PhraseListTypes = {};
  if ('categories' in userContent) {
    allPhrases = Object.entries(userContent.categories).reduce((acc, [category, { phrases }]) => {
      for (const key in phrases) {
        //@ts-ignore
        phrases[key].category = category;
      }
      acc = { ...acc, ...phrases };
      return acc;
    }, {});
  }

  const [phraseList, setPhraseList] = useState<PhraseListTypes>(allPhrases);

  async function deletePhrase(e: React.MouseEvent<HTMLButtonElement>) {
    const target = e.target as HTMLButtonElement;
    if (!target.dataset.id || !target.dataset.category) {
      console.warn('id missing');
    }
    const phraseID: string = target.dataset.id!;
    const category: string = target.dataset.category!;
    await initialiseDeleteRequest({ uid, language: 'cs', phraseID, category });
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchedValue({ ...searchedValue, phrase: e.target.value });
  }
  function renderPhraseList(phrases: PhraseListTypes) {
    const arrayOfPhrases = Object.entries(phrases);

    return arrayOfPhrases.map(([id, phrase]) => (
      <InfoLine heading={phrase.inEnglish} description={phrase.phrase}>
        <ActionButton
          appearance={'cancel'}
          data-id={id}
          data-category={phrase.category}
          onClick={(e) => deletePhrase(e)}
        >
          <CloseIcon />
        </ActionButton>
      </InfoLine>
    ));
  }

  useEffect(() => {
    if (searchedValue.phrase.length > 2) {
      const phrasesThatMatch: PhraseListTypes = {};
      for (const id in phraseList) {
        const phrase = phraseList[id];
        if (phrase.inEnglish.toLowerCase().includes(searchedValue.phrase)) {
          phrasesThatMatch[id] = phrase;
        }
      }
      setPhraseList(phrasesThatMatch);
    } else {
      setPhraseList(allPhrases);
    }
  }, [searchedValue]);
  useEffect(() => {
    setPhraseList(allPhrases);
  }, [userContent]);
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
  ...state.user,
});
const actionCreators = {
  initialiseDeleteRequest,
};
export default connect(mapStateToProps, actionCreators)(PhrasesSection);
