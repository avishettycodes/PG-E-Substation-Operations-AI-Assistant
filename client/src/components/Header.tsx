import React, { useState } from 'react';
import styled from 'styled-components';

// Header container
const HeaderContainer = styled.header`
  background-color: #FFFFFF;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

// Top utility bar
const TopBar = styled.div`
  background-color: #FFFFFF;
  padding: 6px 0;
  border-bottom: 1px solid #e0e0e0;
`;

const TopBarContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 15px;
`;

const SearchContainer = styled.div`
  margin-right: auto;
  position: relative;
  width: 180px;
`;

const SearchInput = styled.input`
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px 30px 4px 8px;
  font-size: 14px;
  width: 100%;
  color: #333333;

  &::placeholder {
    color: #999999;
  }

  &:focus {
    outline: none;
    border-color: #0072CE;
  }
`;

const SearchButton = styled.button`
  background: none;
  border: none;
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #777777;
`;

const UtilityLink = styled.a`
  color: #333333;
  text-decoration: none;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    text-decoration: underline;
  }
`;

const Icon = styled.span`
  font-size: 16px;
  display: flex;
  align-items: center;
`;

// Main navigation bar
const NavBar = styled.div`
  background-color: #FFFFFF;
  padding: 15px 0;
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

// Logo styling
const Logo = styled.a`
  display: block;
  width: 60px;
  height: 60px;
`;

// Main navigation with responsive design
const MainNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 25px;
  margin-left: 30px;
  flex-grow: 1;

  @media (max-width: 768px) {
    display: none;
  }
`;

// Navigation links with hover effect
const NavLink = styled.a`
  color: #333333;
  text-decoration: none;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 15px;
  font-weight: 600;
  padding: 8px 0;

  &:hover {
    text-decoration: underline;
  }
`;

// Sign In button with PG&E styling
const SignInButton = styled.a`
  background-color: #FEC200;
  color: #FFFFFF;
  padding: 10px 16px;
  border-radius: 4px;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
  white-space: nowrap;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #F5B700;
    text-decoration: none;
  }
`;

const UserIcon = styled.span`
  margin-left: 5px;
  font-size: 16px;
`;

// Mobile menu button
const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #333333;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 8px;

  @media (max-width: 768px) {
    display: block;
  }
`;

// Mobile menu
const MobileMenu = styled.div<{ isOpen: boolean }>`
  display: ${props => (props.isOpen ? 'flex' : 'none')};
  flex-direction: column;
  position: absolute;
  left: 0;
  right: 0;
  top: 116px; // Height of header + top bar
  background-color: #FFFFFF;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
  padding: 20px;

  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileNavLink = styled(NavLink)`
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  width: 100%;
`;

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <HeaderContainer>
      <TopBar>
        <TopBarContent>
          <SearchContainer>
            <SearchInput placeholder="Search" />
            <SearchButton>
              🔍
            </SearchButton>
          </SearchContainer>
          <UtilityLink href="/outages">
            <Icon>⚠️</Icon> Outages
          </UtilityLink>
          <UtilityLink href="/contact">
            <Icon>📞</Icon> 1-877-660-6789
          </UtilityLink>
          <UtilityLink href="/language">
            <Icon>🌐</Icon> English
          </UtilityLink>
        </TopBarContent>
      </TopBar>
      <NavBar>
        <NavContent>
          <Logo href="/">
            <svg width="60" height="60" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="256" height="256" fill="#0072CE"/>
              <path d="M20 110 L20 180 L55 180 C55 180 70 180 70 165 C70 150 55 150 55 150 L40 150 L40 180" stroke="white" strokeWidth="10" fill="none"/>
              <path d="M80 110 L80 180 L115 180 C115 180 130 180 130 160 C130 140 115 140 115 140 L100 140 L100 110" stroke="white" strokeWidth="10" fill="none"/>
              <circle cx="170" cy="150" r="25" fill="#FEC200"/>
              <path d="M150 150 L190 150 M170 130 L170 170" stroke="white" strokeWidth="10"/>
              <path d="M200 110 L200 180 L235 180 M200 145 L230 145" stroke="white" strokeWidth="10" fill="none"/>
            </svg>
          </Logo>
          <MainNav>
            <NavLink href="/account">Account</NavLink>
            <NavLink href="/outages">Outages & Safety</NavLink>
            <NavLink href="/save">Save Energy & Money</NavLink>
            <NavLink href="/business">Business Resources</NavLink>
            <NavLink href="/clean">Clean Energy</NavLink>
          </MainNav>
          <SignInButton href="/signin">
            Sign In <UserIcon>👤</UserIcon>
          </SignInButton>
          <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            ☰
          </MobileMenuButton>
        </NavContent>
      </NavBar>
      <MobileMenu isOpen={isMobileMenuOpen}>
        <MobileNavLink href="/account">Account</MobileNavLink>
        <MobileNavLink href="/outages">Outages & Safety</MobileNavLink>
        <MobileNavLink href="/save">Save Energy & Money</MobileNavLink>
        <MobileNavLink href="/business">Business Resources</MobileNavLink>
        <MobileNavLink href="/clean">Clean Energy</MobileNavLink>
        <SignInButton style={{ marginTop: '15px' }}>
          Sign In <UserIcon>👤</UserIcon>
        </SignInButton>
      </MobileMenu>
    </HeaderContainer>
  );
};

export default Header; 