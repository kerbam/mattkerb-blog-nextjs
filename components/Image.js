import NextImage from 'next/image'

// eslint-disable-next-line jsx-a11y/alt-text
const Image = ({ ...rest }) => (
  <NextImage
    {...rest}
    style={{
      maxWidth: '100%',
      height: 'auto',
    }}
  />
)

export default Image
