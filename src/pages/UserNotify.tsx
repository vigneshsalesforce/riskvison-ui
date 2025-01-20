import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, styled, keyframes } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowForward, ErrorOutline } from '@mui/icons-material';

// Enhanced animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const UserNotifyContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  padding: theme.spacing(3),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #3490dc, #6574cd)',
  },
}));

const UserNotifyCard = styled(motion.div)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  padding: theme.spacing(6),
  borderRadius: theme.spacing(3),
  boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 5px 15px rgba(0,0,0,0.05)',
  textAlign: 'center',
  maxWidth: '500px',
  width: '100%',
  animation: `${fadeInUp} 0.6s ease-out`,
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #3490dc, #6574cd)',
    transform: 'scaleX(0)',
    transition: 'transform 0.3s ease',
  },
  '&:hover::after': {
    transform: 'scaleX(1)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4),
    maxWidth: '95%',
    margin: theme.spacing(2),
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  height: '120px',
  width: '120px',
  margin: '0 auto',
  marginBottom: theme.spacing(4),
  position: 'relative',
  '& svg': {
    fontSize: '4rem',
    color: '#3490dc',
    animation: `${pulse} 2s infinite ease-in-out`,
  },
  [theme.breakpoints.down('sm')]: {
    height: '100px',
    width: '100px',
    '& svg': {
      fontSize: '3rem',
    },
  },
}));

const UserNotifyMessage = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  color: '#2d3748',
  marginBottom: theme.spacing(5),
  lineHeight: 1.7,
  fontWeight: 500,
  opacity: 0,
  animation: `${fadeInUp} 0.6s ease-out forwards`,
  animationDelay: '0.2s',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.25rem',
    marginBottom: theme.spacing(4),
  },
}));

const UserNotifyButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#3490dc',
  color: 'white',
  padding: theme.spacing(1.75, 4),
  borderRadius: '50px',
  fontSize: '1.1rem',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  boxShadow: '0 4px 12px rgba(52, 144, 220, 0.25)',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#2779bd',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(52, 144, 220, 0.35)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  '&:focus': {
    outline: 'none',
    boxShadow: '0 0 0 3px rgba(52, 144, 220, 0.4)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5, 3),
    fontSize: '1rem',
  },
}));

const UserNotify: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -50,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <UserNotifyContainer>
      <AnimatePresence>
        <UserNotifyCard
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <LogoContainer>
            <ErrorOutline sx={{ width: '100%', height: '100%' }} />
          </LogoContainer>
          <UserNotifyMessage variant="h2">
            User not found in the tenant.
            <br />
            Please contact your administrator.
          </UserNotifyMessage>
          <UserNotifyButton
            onClick={handleNavigateToLogin}
            variant="contained"
            endIcon={<ArrowForward />}
          >
            Return to Login
          </UserNotifyButton>
        </UserNotifyCard>
      </AnimatePresence>
    </UserNotifyContainer>
  );
};

export default UserNotify;