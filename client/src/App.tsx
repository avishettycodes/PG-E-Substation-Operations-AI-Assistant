import React from 'react';
import styled from 'styled-components';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatInterface from './components/ChatInterface';

// Main app container
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
`;

// Main content area with chatbot
const MainContent = styled.main`
  flex: 1;
  padding: 50px 20px;
  padding-top: 140px; /* Add extra padding to account for fixed header */
  background-color: white;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 36px;
  margin-bottom: 10px;
  color: #333333;
  text-align: center;
`;

const SectionSubtitle = styled.p`
  font-size: 18px;
  margin-bottom: 30px;
  color: #666666;
  text-align: center;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const App: React.FC = () => {
  return (
    <AppContainer>
      <Header />
      
      <MainContent id="chatbot">
        <ContentContainer>
          <SectionTitle>PG&E Substation Operations Assistant</SectionTitle>
          <SectionSubtitle>
            Get immediate answers to your questions about substation operations, maintenance procedures, safety protocols, and more.
          </SectionSubtitle>
          <ChatInterface />
        </ContentContainer>
      </MainContent>
      
      <Footer />
    </AppContainer>
  );
};

export default App; 