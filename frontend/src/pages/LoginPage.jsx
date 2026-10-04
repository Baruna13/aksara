import styled from 'styled-components';
import AuthForm from '../components/AuthForm.jsx';

export default function LoginPage() {
  return (
    <Page>
      <Brand>
        <span className="aksara">ꦲꦏ꧀ꦱꦫꦗꦮ</span>
        <span className="name">Rembug AksaraLens</span>
      </Brand>
      <AuthForm />
    </Page>
  );
}

const Page = styled.main`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 24px 16px;
`;

const Brand = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;

  .aksara {
    font-family: 'Noto Sans Javanese', serif;
    font-size: 40px;
    line-height: 1.3;
  }
  .name {
    font-family: var(--font-DelaGothicOne);
    font-size: 18px;
  }
`;
