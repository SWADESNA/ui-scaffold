import { Box, Button, Flex, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Outlet, Link as ReactRouterLink, useNavigate } from 'react-router-dom'
import Logo from '~components/Layout/Logo'
import { Close } from '~theme/icons'

const LayoutProcessCreate = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <Box bgColor='process_create.bg' maxW='site-width' mx='auto'>
      <Flex direction='column' minH='100vh'>
        <Flex
          as='header'
          position='relative'
          justifyContent='space-between'
          alignItems='center'
          w='full'
          p={{ base: '12px 10px', sm: '12px 20px', md: '24px 40px' }}
        >
          <Logo />

          <Button
            as={ReactRouterLink}
            variant='close-form'
            onClick={(e) => (window.history.state.idx ? navigate(-1) : navigate('/'))}
          >
            <Close />
            {t('form.process_create.navbar.close_form_btn')}
          </Button>
        </Flex>

        <Box as='main' w='full' px={{ base: '40px', md: '80px' }}>
          <Outlet />
        </Box>
      </Flex>
      {import.meta.env.theme === 'onvote' && (
        <Text
          top='calc(50vh - 90px)'
          position='fixed'
          sx={{
            '&': {
              writingMode: 'vertical-lr',
              textOrientation: 'mixed',
              transform: 'rotate(180deg)',
            },
          }}
          color='black'
          textTransform='uppercase'
          fontFamily='pixeloidsans'
          fontSize='16px'
          display={{ base: 'none', md: 'block' }}
        >
          World wide voting
        </Text>
      )}
    </Box>
  )
}

export default LayoutProcessCreate
