import SportPage from '@/components/SportPage'

export default function FootballPage(){
  return <SportPage name="Football" intro="A new Manchester Select platform for football events that connect clubs, businesses and communities around a cause." events={[
    ['Manchester Select Football','Launching soon — a new way for Manchester football to play for something bigger.'],
    ['Club & community events','Bring your squad, supporters and story to a Manchester Select event.']
  ]}/>
}
