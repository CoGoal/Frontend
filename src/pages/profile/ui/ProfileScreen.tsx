import ProfileGate from './ProfileGate'
import ProfileView from './ProfileView'

export default function ProfileScreen() {
    return <ProfileGate>{(profile) => <ProfileView profile={profile} />}</ProfileGate>
}