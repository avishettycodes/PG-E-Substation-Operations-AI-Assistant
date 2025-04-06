import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #333333;
  color: #FFFFFF;
  padding: 40px 0 20px;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 15px;
  font-weight: 600;
`;

const FooterLink = styled.a`
  color: #CCCCCC;
  text-decoration: none;
  margin-bottom: 10px;
  font-size: 14px;
  transition: color 0.2s;
  
  &:hover {
    color: #FFFFFF;
    text-decoration: underline;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: 20px 0;
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const FooterCopyright = styled.p`
  font-size: 14px;
  color: #AAAAAA;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
`;

const SocialLink = styled.a`
  color: #FFFFFF;
  font-size: 18px;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.8;
  }
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
          <FooterColumn>
            <FooterTitle>About PG&E</FooterTitle>
            <FooterLink href="/company-profile">Company Profile</FooterLink>
            <FooterLink href="/careers">Careers</FooterLink>
            <FooterLink href="/news-room">News Room</FooterLink>
            <FooterLink href="/investor-relations">Investor Relations</FooterLink>
          </FooterColumn>
          
          <FooterColumn>
            <FooterTitle>Customer Support</FooterTitle>
            <FooterLink href="/contact">Contact Us</FooterLink>
            <FooterLink href="/billing">Billing & Payment</FooterLink>
            <FooterLink href="/outages">Outage Center</FooterLink>
            <FooterLink href="/rebates">Rebates & Incentives</FooterLink>
          </FooterColumn>
          
          <FooterColumn>
            <FooterTitle>Safety & Community</FooterTitle>
            <FooterLink href="/safety-tips">Safety Tips</FooterLink>
            <FooterLink href="/wildfire-safety">Wildfire Safety</FooterLink>
            <FooterLink href="/emergency-preparedness">Emergency Preparedness</FooterLink>
            <FooterLink href="/community-involvement">Community Involvement</FooterLink>
          </FooterColumn>
          
          <FooterColumn>
            <FooterTitle>Clean Energy</FooterTitle>
            <FooterLink href="/renewable-energy">Renewable Energy</FooterLink>
            <FooterLink href="/electric-vehicles">Electric Vehicles</FooterLink>
            <FooterLink href="/solar">Solar Power</FooterLink>
            <FooterLink href="/sustainability">Sustainability</FooterLink>
          </FooterColumn>
        </FooterGrid>
        
        <Divider />
        
        <FooterBottom>
          <FooterCopyright>
            © {new Date().getFullYear()} Pacific Gas and Electric Company. All rights reserved.
          </FooterCopyright>
          
          <SocialLinks>
            <SocialLink href="https://facebook.com/pacificgasandelectric" aria-label="Facebook">
              <span role="img" aria-label="Facebook">📘</span>
            </SocialLink>
            <SocialLink href="https://twitter.com/pge4me" aria-label="Twitter">
              <span role="img" aria-label="Twitter">🐦</span>
            </SocialLink>
            <SocialLink href="https://instagram.com/pacificgasandelectric" aria-label="Instagram">
              <span role="img" aria-label="Instagram">📸</span>
            </SocialLink>
            <SocialLink href="https://linkedin.com/company/pacific-gas-and-electric-company" aria-label="LinkedIn">
              <span role="img" aria-label="LinkedIn">🔗</span>
            </SocialLink>
            <SocialLink href="https://youtube.com/user/pgevideo" aria-label="YouTube">
              <span role="img" aria-label="YouTube">🎬</span>
            </SocialLink>
          </SocialLinks>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer; 