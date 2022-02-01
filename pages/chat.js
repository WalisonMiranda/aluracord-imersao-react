import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Text, TextField, Image, Button } from '@skynexui/components';

import appConfig from '../config.json';
import { supabaseClient } from '../api/api.js';

import { ButtonSendSticker } from '../src/components/ButtonSendSticker';

const databaseListener = (newMessage) => {
  return supabaseClient.from('mensagens')
         .on('INSERT', (realtimeMessage) => {
          newMessage(realtimeMessage.new);
         })
         .subscribe();
}

export default function Chat() {
  const router = useRouter();
  const user = router.query.username;
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmitMessage = (message) => {
    const newMessage = {
      text: message,
      from: user,
    };

    supabaseClient.from('mensagens')
      .insert([newMessage])
      .then(() => {
      });
      
    setMessage('');
  }
  
  useEffect(() => {    
    supabaseClient.from('mensagens')
      .select('*')
      .order('id', {ascending: false})
      .then(({ data }) => {
        setMessages(data);
      });

    databaseListener((newMessage) => {
      setMessages((currentList) => {
        return [
          newMessage,
          ...currentList
        ]
      });
    });
  }, []);

  return (
    <Box
      styleSheet={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
        backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
        color: appConfig.theme.colors.neutrals['000']
      }}
    >
      <Box
        styleSheet={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
          borderRadius: '5px',
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: '100%',
          maxWidth: '95%',
          maxHeight: '95vh',
          padding: '32px',
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: 'relative',
            display: 'flex',
            flex: 1,
            height: '80%',
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: 'column',
            borderRadius: '5px',
            padding: '16px',
          }}
        >
          <MessageList messages={messages} />

          <Box
            as="form"
            styleSheet={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TextField
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitMessage(message);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: '100%',
                border: '0',
                resize: 'none',
                borderRadius: '5px',
                padding: '6px 8px',
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: '12px',
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            <ButtonSendSticker 
              onStickerClick={(sticker) => handleSubmitMessage(`:sticker: ${sticker}`)}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

function Header() {
  return (
    <>
      <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
        <Text variant='heading5'>
          Chat
        </Text>
        <Button
          variant='tertiary'
          colorVariant='neutral'
          label='Logout'
          href="/"
        />
      </Box>
    </>
  )
}

function MessageList({ messages }) {

  return (
    <Box
      tag="ul"
      styleSheet={{
        overflowY: 'scroll',
        display: 'flex',
        flexDirection: 'column-reverse',
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: '16px',
      }}
    >
      {messages.map(message => {
        return (
          <Text
            key={message.id}
            tag="li"
            styleSheet={{
              borderRadius: '5px',
              padding: '6px',
              marginBottom: '12px',
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              }
            }}
          >
            <Box
              styleSheet={{
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'flex-start'
              }}
            >
              <Image
                styleSheet={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  marginRight: '8px',
                }}
                src={`https://github.com/${message.from}.png`}
              />
              <Text tag="strong">
                {message.from}
              </Text>
              <Text
                styleSheet={{
                  fontSize: '10px',
                  marginLeft: '8px',
                  padding: '4px 0',
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {message.created_at}
              </Text>
            </Box>
            {message.text.startsWith(':sticker:') ? <Image src={message.text.replace(':sticker:', '')} alt={message.text} />
              : message.text
            }
          </Text>
        );
      })}
    </Box>
  )
}
