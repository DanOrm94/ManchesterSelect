import SportPage from '@/components/SportPage'

export default function NetballPage(){
  return <SportPage name="Netball" intro="A welcoming, competitive space for netball to raise money, build community and create opportunity." events={[
    ['Manchester Select Netball','Launching soon — event details, team entries and supporter opportunities will appear here.'],
    ['More than a match','Partner with us to help grow inclusive sporting opportunities across Greater Manchester.']
  ]}/>
}
