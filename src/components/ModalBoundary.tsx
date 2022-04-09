import InfoModal from './InfoModal';
import { connect } from 'react-redux';

const ModalBoundary = ({ children, infoModal }: any) => {
  const { type, message } = infoModal;
  return (
    <>
      {children}
      {message && <InfoModal type={type} message={message} />}
    </>
  );
};
const mapStateToProps = (state: any) => ({
  infoModal: state.infoModal,
});
export default connect(mapStateToProps)(ModalBoundary);
