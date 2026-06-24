// =====================================================
//  GROWUP — Demo Expo Snack (aucun backend requis)
//  Coller ce fichier sur snack.expo.dev
// =====================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Animated, Dimensions, TextInput, StatusBar, Platform,
  Modal, SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width: W, height: H } = Dimensions.get('window');

// ─── Thème ───────────────────────────────────────────
const C = {
  bg: '#0A0A1A', surface: '#12122A', surfaceL: '#1E1E40',
  border: '#2A2A5A', text: '#F0F0FF', muted: '#8888B8',
  dim: '#606098', primary: '#7C3AED', primaryL: '#A78BFA',
  accent: '#EC4899', success: '#22C55E', gold: '#F59E0B',
  warning: '#F59E0B', error: '#EF4444',
};
const G = {
  primary: ['#7C3AED', '#EC4899'] as const,
  grandir: ['#5B21B6', '#7C3AED'] as const,
  glowup:  ['#BE185D', '#EC4899'] as const,
  dark:    ['#0A0A1A', '#12122A'] as const,
  gold:    ['#D97706', '#F59E0B'] as const,
  success: ['#16A34A', '#22C55E'] as const,
};

// ─── Données mock ────────────────────────────────────
const USER = {
  name: 'Alex Martin', email: 'alex@growup.app',
  height: 172, weight: 68, target: 177,
  xp: 1240, level: 3, rank: '⚡ Apprenti',
  streak: 12, rankColor: '#60A5FA',
};

const PROGRAM: Record<string, any[]> = {
  grandir: [
    {
      id: 'g1', level: 1, title: 'Fondations', icon: '🌱',
      unlocked: true, badge: 'Niveau 1',
      days: [
        { id:'d1', day:1, title:'Activation corporelle', xp:60, min:25, done:true,
          exercises:[
            {name:'Étirements colonne',dur:60,sets:3,xp:10,diff:'easy',groups:['Dos']},
            {name:'Suspension barre',dur:30,sets:4,xp:15,diff:'medium',groups:['Épaules','Dos']},
            {name:'Cobra Yoga',dur:45,sets:3,xp:10,diff:'easy',groups:['Colonne']},
            {name:'Sauts en étoile',dur:30,sets:3,xp:12,diff:'easy',groups:['Cardio']},
          ]},
        { id:'d2', day:2, title:'Colonne vertébrale forte', xp:65, min:30, done:true,
          exercises:[
            {name:'Chat-Vache',dur:60,sets:4,xp:12,diff:'easy',groups:['Colonne','Dos']},
            {name:'Planche',dur:30,sets:4,xp:15,diff:'medium',groups:['Abdos','Dos']},
            {name:'Superman',dur:45,sets:3,xp:12,diff:'easy',groups:['Dos','Fessiers']},
            {name:'Rotation bassin',dur:45,sets:2,xp:10,diff:'easy',groups:['Hanches']},
          ]},
        { id:'d3', day:3, title:'Repos actif 😴', xp:30, min:15, done:true, rest:true,
          exercises:[{name:'Marche consciente',dur:900,sets:1,xp:15,diff:'easy',groups:['Corps entier']},{name:'Étirements doux',dur:600,sets:1,xp:15,diff:'easy',groups:['Corps entier']}]},
        { id:'d4', day:4, title:'Force & Longueur', xp:70, min:35, done:false,
          exercises:[
            {name:'Fentes avant',reps:12,sets:3,xp:15,diff:'medium',groups:['Jambes','Hanches']},
            {name:'Squats profonds',reps:15,sets:3,xp:15,diff:'medium',groups:['Quadriceps']},
            {name:'Pont fessier',reps:15,sets:3,xp:12,diff:'easy',groups:['Fessiers']},
            {name:'Étirement psoas',dur:45,sets:3,xp:10,diff:'easy',groups:['Psoas']},
          ]},
        { id:'d5', day:5, title:'Mobilité des épaules', xp:60, min:25, done:false,
          exercises:[
            {name:'Rotation des bras',dur:30,sets:3,xp:10,diff:'easy',groups:['Épaules']},
            {name:'Ouverture thoracique',dur:45,sets:4,xp:12,diff:'easy',groups:['Poitrine']},
            {name:'Traction australienne',reps:10,sets:3,xp:15,diff:'medium',groups:['Dos','Biceps']},
            {name:'Chien tête en bas',dur:60,sets:3,xp:12,diff:'easy',groups:['Dos','Ischio']},
          ]},
        { id:'d6', day:6, title:'Sprint & Sauts', xp:75, min:30, done:false,
          exercises:[
            {name:'Sprint 20m',reps:8,sets:1,xp:20,diff:'hard',groups:['Jambes','Cardio']},
            {name:'Sauts verticaux',reps:10,sets:4,xp:15,diff:'medium',groups:['Jambes']},
            {name:'Corde à sauter',dur:120,sets:3,xp:15,diff:'medium',groups:['Cardio']},
          ]},
        { id:'d7', day:7, title:'Repos complet 🛌', xp:20, min:5, done:false, rest:true,
          exercises:[{name:'Méditation du soir',dur:300,sets:1,xp:20,diff:'easy',groups:['Mental']}]},
      ]
    },
    {
      id: 'g2', level: 2, title: 'Élan', icon: '⚡',
      unlocked: true, badge: 'Niveau 2',
      days: [
        { id:'d8', day:1, title:'Force explosive', xp:90, min:40, done:false,
          exercises:[
            {name:'Burpees',reps:10,sets:4,xp:20,diff:'hard',groups:['Corps entier']},
            {name:'Pompes diamant',reps:12,sets:4,xp:18,diff:'hard',groups:['Triceps']},
            {name:'Suspension longue',dur:60,sets:4,xp:20,diff:'hard',groups:['Colonne']},
            {name:'Fentes sautées',reps:12,sets:3,xp:18,diff:'hard',groups:['Jambes']},
          ]},
        { id:'d9', day:2, title:'Yoga croissance', xp:80, min:35, done:false,
          exercises:[
            {name:'Salutation au soleil',dur:300,sets:3,xp:25,diff:'medium',groups:['Corps entier']},
            {name:'Guerrier I',dur:45,sets:3,xp:15,diff:'medium',groups:['Jambes','Dos']},
            {name:'Posture de la roue',dur:30,sets:4,xp:20,diff:'hard',groups:['Colonne']},
          ]},
        ...Array.from({length:5},(_,i)=>({ id:`d${10+i}`, day:i+3, title:`Jour ${i+3}`, xp:70+i*5, min:30, done:false, exercises:[{name:'Exercice',reps:10,sets:3,xp:15,diff:'medium',groups:['Corps entier']}]})),
      ]
    },
    { id:'g3', level:3, title:'Ascension', icon:'🚀', unlocked:false, badge:'🔒 1500 XP', days:[] },
  ],
  glowup: [
    {
      id:'gu1', level:1, title:'Éveil', icon:'✨', unlocked:true, badge:'Niveau 1',
      days:[
        { id:'gu-d1', day:1, title:'Routine du matin', xp:55, min:20, done:true,
          exercises:[
            {name:'Hydratation consciente',dur:120,sets:1,xp:10,diff:'easy',groups:['Bien-être']},
            {name:'Stretching matinal',dur:600,sets:1,xp:15,diff:'easy',groups:['Corps entier']},
            {name:'Journaling ✍️',dur:300,sets:1,xp:15,diff:'easy',groups:['Mental']},
            {name:'Skin care matinal',dur:300,sets:1,xp:15,diff:'easy',groups:['Peau']},
          ]},
        { id:'gu-d2', day:2, title:'Corps & Posture', xp:60, min:25, done:true,
          exercises:[
            {name:'Correction posturale',dur:120,sets:5,xp:15,diff:'easy',groups:['Dos']},
            {name:'Pilates débutant',dur:1200,sets:1,xp:25,diff:'medium',groups:['Abdos','Dos']},
            {name:'Massage facial Gua Sha',dur:300,sets:1,xp:15,diff:'easy',groups:['Visage']},
          ]},
        { id:'gu-d3', day:3, title:'Détox & Nutrition', xp:50, min:15, done:false,
          exercises:[
            {name:'Jus vert du matin 🥤',dur:600,sets:1,xp:20,diff:'easy',groups:['Nutrition']},
            {name:'Repas anti-inflammatoire',dur:1800,sets:1,xp:20,diff:'easy',groups:['Nutrition']},
            {name:'Objectif 2,5L d\'eau 💧',dur:60,sets:1,xp:15,diff:'easy',groups:['Hydratation']},
          ]},
        ...Array.from({length:4},(_,i)=>({ id:`gu-d${4+i}`, day:i+4, title:`Jour ${i+4}`, xp:55, min:25, done:false, exercises:[{name:'Activité bien-être',dur:600,sets:1,xp:20,diff:'easy',groups:['Bien-être']}]})),
      ]
    },
    { id:'gu2', level:2, title:'Rayonnement', icon:'🌟', unlocked:false, badge:'🔒 500 XP', days:[] },
  ]
};

const CHALLENGES = [
  { id:'c1', icon:'💧', title:'Hydratation', desc:'Boire 2,5L d\'eau aujourd\'hui', xp:25, done:false },
  { id:'c2', icon:'😴', title:'Sommeil réparateur', desc:'Dormir 8h cette nuit', xp:30, done:false },
  { id:'c3', icon:'🧘', title:'Étirement du matin', desc:'10 min de stretching au réveil', xp:20, done:false },
  { id:'c4', icon:'🥗', title:'Repas équilibré', desc:'Manger 5 fruits & légumes aujourd\'hui', xp:25, done:false },
  { id:'c5', icon:'🚶', title:'10 000 pas', desc:'Atteindre 10 000 pas aujourd\'hui', xp:35, done:false },
];

const ACHIEVEMENTS = [
  { icon:'👟', title:'Premier pas', desc:'1er entraînement', xp:50, done:true },
  { icon:'🔥', title:'Semaine parfaite', desc:'Streak 7 jours', xp:200, done:true },
  { icon:'💪', title:'Assidu', desc:'10 entraînements', xp:100, done:true },
  { icon:'⚡', title:'Montée en puissance', desc:'Niveau 5', xp:150, done:false },
  { icon:'🏆', title:'Vétéran', desc:'Niveau 10', xp:300, done:false },
  { icon:'💎', title:'Infatigable', desc:'50 entraînements', xp:400, done:false },
  { icon:'📏', title:'Premier centimètre', desc:'+1 cm de taille', xp:300, done:false },
  { icon:'🚀', title:'Transformation', desc:'+5 cm de taille', xp:1000, done:false },
];

// ─── Composants réutilisables ─────────────────────────
function Card({ children, style }: any) {
  return <View style={[s.card, style]}>{children}</View>;
}

function XPBar({ xp, level }: { xp: number; level: number }) {
  const pct = (xp % 500) / 500;
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, { toValue: pct, useNativeDriver: false }).start();
  }, [pct]);
  const w = anim.interpolate({ inputRange:[0,1], outputRange:['0%','100%'], extrapolate:'clamp' });
  return (
    <View style={{gap:6}}>
      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
        <Text style={{color:C.muted,fontSize:12,fontWeight:'600'}}>Niveau {level}</Text>
        <Text style={{color:C.primaryL,fontSize:12,fontWeight:'700'}}>{xp%500} / 500 XP</Text>
      </View>
      <View style={{height:8,backgroundColor:C.surfaceL,borderRadius:4,overflow:'hidden'}}>
        <Animated.View style={{height:'100%',width:w,borderRadius:4,overflow:'hidden'}}>
          <LinearGradient colors={G.primary} start={{x:0,y:0}} end={{x:1,y:0}} style={StyleSheet.absoluteFillObject}/>
        </Animated.View>
      </View>
    </View>
  );
}

function StreakBadge({ n }: { n: number }) {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(pulse,{toValue:1.1,duration:700,useNativeDriver:true}),
      Animated.timing(pulse,{toValue:1,duration:700,useNativeDriver:true}),
    ])).start();
  },[]);
  return (
    <Animated.View style={{transform:[{scale:pulse}]}}>
      <LinearGradient colors={n>=7?['#F59E0B','#EF4444'] as const:G.primary} style={{width:52,height:52,borderRadius:26,alignItems:'center',justifyContent:'center'}}>
        <Text style={{fontSize:14}}>{n>=7?'🔥':'⚡'}</Text>
        <Text style={{color:'#fff',fontWeight:'800',fontSize:13,lineHeight:14}}>{n}</Text>
      </LinearGradient>
    </Animated.View>
  );
}

// ─── Écran Login ──────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn,{toValue:1,duration:800,useNativeDriver:true}),
      Animated.spring(slideUp,{toValue:0,useNativeDriver:true}),
    ]).start();
  },[]);

  return (
    <LinearGradient colors={G.dark} style={{flex:1}}>
      <SafeAreaView style={{flex:1,justifyContent:'center',padding:28}}>
        <Animated.View style={{opacity:fadeIn,transform:[{translateY:slideUp}],gap:20}}>
          {/* Logo */}
          <View style={{alignItems:'center',marginBottom:16}}>
            <LinearGradient colors={G.primary} style={{width:88,height:88,borderRadius:44,alignItems:'center',justifyContent:'center',marginBottom:14}}>
              <Text style={{fontSize:44}}>🌱</Text>
            </LinearGradient>
            <Text style={{color:C.text,fontSize:36,fontWeight:'900',letterSpacing:-1}}>GrowUp</Text>
            <Text style={{color:C.muted,fontSize:15,marginTop:4,textAlign:'center'}}>Deviens la meilleure version de toi-même</Text>
          </View>

          <Text style={{color:C.text,fontSize:24,fontWeight:'800'}}>Bon retour 👋</Text>

          <View style={s.input}>
            <Ionicons name="mail-outline" size={20} color={C.dim} style={{marginRight:10}}/>
            <TextInput style={{flex:1,color:C.text,fontSize:15,paddingVertical:14}} placeholder="Email" placeholderTextColor={C.dim} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"/>
          </View>
          <View style={s.input}>
            <Ionicons name="lock-closed-outline" size={20} color={C.dim} style={{marginRight:10}}/>
            <TextInput style={{flex:1,color:C.text,fontSize:15,paddingVertical:14}} placeholder="Mot de passe" placeholderTextColor={C.dim} value={pass} onChangeText={setPass} secureTextEntry/>
          </View>

          <TouchableOpacity onPress={onLogin} activeOpacity={0.85} style={{borderRadius:14,overflow:'hidden'}}>
            <LinearGradient colors={G.primary} start={{x:0,y:0}} end={{x:1,y:0}} style={{paddingVertical:16,alignItems:'center'}}>
              <Text style={{color:'#fff',fontSize:16,fontWeight:'800',letterSpacing:0.3}}>Se connecter</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={{flexDirection:'row',alignItems:'center',gap:12}}>
            <View style={{flex:1,height:1,backgroundColor:C.border}}/>
            <Text style={{color:C.dim,fontSize:13}}>ou</Text>
            <View style={{flex:1,height:1,backgroundColor:C.border}}/>
          </View>

          <TouchableOpacity onPress={onLogin} style={[s.input,{justifyContent:'center',gap:10}]}>
            <Text style={{fontSize:18}}>🔐</Text>
            <Text style={{color:C.text,fontSize:15,fontWeight:'600'}}>Continuer avec Google</Text>
          </TouchableOpacity>

          <Text style={{color:C.muted,fontSize:12,textAlign:'center'}}>
            💡 Demo : appuie sur "Se connecter" sans remplir les champs
          </Text>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ─── Écran Programme ──────────────────────────────────
function ProgramScreen({ onStartDay }: { onStartDay: (day: any, mode: string) => void }) {
  const [mode, setMode] = useState<'grandir'|'glowup'>('grandir');
  const [expanded, setExpanded] = useState<string|null>('g1');
  const levels = PROGRAM[mode];
  const totalDays = levels.flatMap(l=>l.days).length;
  const doneDays = levels.flatMap(l=>l.days).filter((d:any)=>d.done).length;
  const pct = totalDays > 0 ? doneDays/totalDays : 0;
  const accentG = mode==='grandir' ? G.grandir : G.glowup;
  const accentC = mode==='grandir' ? C.primary : C.accent;

  return (
    <ScrollView style={{flex:1,backgroundColor:C.bg}} contentContainerStyle={{padding:20,paddingTop:60,paddingBottom:100}}>
      {/* Header */}
      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
        <View>
          <Text style={{color:C.text,fontSize:22,fontWeight:'800'}}>Bonjour Alex 👋</Text>
          <Text style={{color:C.primaryL,fontSize:13,fontWeight:'700',marginTop:2}}>⚡ Apprenti</Text>
        </View>
        <StreakBadge n={USER.streak}/>
      </View>

      {/* XP Card */}
      <Card style={{marginBottom:14}}><XPBar xp={USER.xp} level={USER.level}/></Card>

      {/* Progress card */}
      <Card style={{marginBottom:20}}>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <View>
            <Text style={{color:C.muted,fontSize:12,marginBottom:4}}>Progression globale</Text>
            <Text style={{color:C.text,fontSize:20,fontWeight:'800'}}>{doneDays} / {totalDays} jours</Text>
          </View>
          <LinearGradient colors={accentG} style={{width:52,height:52,borderRadius:26,alignItems:'center',justifyContent:'center'}}>
            <Text style={{color:'#fff',fontSize:15,fontWeight:'800'}}>{Math.round(pct*100)}%</Text>
          </LinearGradient>
        </View>
        <View style={{height:6,backgroundColor:C.border,borderRadius:3,overflow:'hidden'}}>
          <LinearGradient colors={accentG} start={{x:0,y:0}} end={{x:1,y:0}} style={{height:'100%',width:`${Math.max(4,pct*100)}%`,borderRadius:3}}/>
        </View>
      </Card>

      {/* Mode switcher */}
      <View style={{flexDirection:'row',gap:12,marginBottom:24}}>
        {(['grandir','glowup'] as const).map(m=>(
          <TouchableOpacity key={m} onPress={()=>{setMode(m);setExpanded(null);}} style={{flex:1,borderRadius:14,overflow:'hidden',borderWidth:2,borderColor:mode===m?(m==='grandir'?C.primary:C.accent):C.border}}>
            {mode===m ? (
              <LinearGradient colors={m==='grandir'?G.grandir:G.glowup} style={{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,paddingVertical:14}}>
                <Text style={{fontSize:18}}>{m==='grandir'?'💪':'✨'}</Text>
                <Text style={{color:'#fff',fontWeight:'800',fontSize:14}}>{m==='grandir'?'Grandir':'Glow Up'}</Text>
              </LinearGradient>
            ) : (
              <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,paddingVertical:14,backgroundColor:C.surface}}>
                <Text style={{fontSize:18}}>{m==='grandir'?'💪':'✨'}</Text>
                <Text style={{color:C.muted,fontWeight:'700',fontSize:14}}>{m==='grandir'?'Grandir':'Glow Up'}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Levels */}
      {levels.map((lv:any) => {
        const isOpen = expanded === lv.id;
        const lvDone = lv.days.filter((d:any)=>d.done).length;
        const lvPct = lv.days.length > 0 ? lvDone/lv.days.length : 0;
        return (
          <View key={lv.id} style={{marginBottom:12}}>
            <TouchableOpacity
              onPress={()=>lv.unlocked && setExpanded(isOpen?null:lv.id)}
              activeOpacity={lv.unlocked?0.8:1}
              style={{borderRadius:16,overflow:'hidden',borderWidth:1,borderColor:C.border,opacity:lv.unlocked?1:0.6}}
            >
              <LinearGradient colors={lv.unlocked?accentG:['#1E1E40','#12122A'] as const} start={{x:0,y:0}} end={{x:1,y:0}} style={{flexDirection:'row',alignItems:'center',padding:16,gap:14}}>
                <View style={{width:46,height:46,borderRadius:23,backgroundColor:'rgba(255,255,255,0.2)',alignItems:'center',justifyContent:'center'}}>
                  <Text style={{fontSize:24}}>{lv.unlocked?lv.icon:'🔒'}</Text>
                </View>
                <View style={{flex:1}}>
                  <Text style={{color:'rgba(255,255,255,0.7)',fontSize:11,fontWeight:'600',letterSpacing:0.5,marginBottom:2}}>{lv.badge}</Text>
                  <Text style={{color:'#fff',fontSize:17,fontWeight:'800'}}>{lv.title}</Text>
                  {lv.unlocked && lv.days.length>0 && (
                    <View style={{flexDirection:'row',alignItems:'center',gap:10,marginTop:6}}>
                      <Text style={{color:'rgba(255,255,255,0.7)',fontSize:12}}>{lvDone}/{lv.days.length} jours</Text>
                      <View style={{flex:1,height:4,backgroundColor:'rgba(255,255,255,0.2)',borderRadius:2,overflow:'hidden'}}>
                        <View style={{height:'100%',backgroundColor:'rgba(255,255,255,0.8)',width:`${lvPct*100}%`,borderRadius:2}}/>
                      </View>
                    </View>
                  )}
                </View>
                {lv.unlocked && <Ionicons name={isOpen?'chevron-up':'chevron-down'} size={20} color="rgba(255,255,255,0.7)"/>}
              </LinearGradient>
            </TouchableOpacity>

            {isOpen && lv.days.map((day:any) => (
              <TouchableOpacity key={day.id} onPress={()=>onStartDay(day, mode)} activeOpacity={0.8}
                style={{marginTop:8,marginLeft:12,backgroundColor:day.done?C.success+'15':C.surface,borderRadius:12,borderWidth:1,borderColor:day.done?C.success+'50':C.border,flexDirection:'row',alignItems:'center',overflow:'hidden'}}>
                <LinearGradient colors={day.done?G.success:accentG} start={{x:0,y:0}} end={{x:0,y:1}} style={{width:4,alignSelf:'stretch'}}/>
                <View style={{width:34,height:34,borderRadius:17,backgroundColor:(day.done?C.success:accentC)+'25',alignItems:'center',justifyContent:'center',margin:10}}>
                  <Text style={{color:day.done?C.success:accentC,fontWeight:'800',fontSize:13}}>{day.day}</Text>
                </View>
                <View style={{flex:1,paddingVertical:12}}>
                  <Text style={{color:C.text,fontWeight:'700',fontSize:14,marginBottom:2}}>{day.title}</Text>
                  <View style={{flexDirection:'row',gap:12}}>
                    <Text style={{color:C.dim,fontSize:11}}>⏱ {day.min}min</Text>
                    <Text style={{color:C.dim,fontSize:11}}>⚡ +{day.xp}XP</Text>
                    {!day.rest && <Text style={{color:C.dim,fontSize:11}}>🏋️ {day.exercises.length} exos</Text>}
                  </View>
                </View>
                {day.done
                  ? <Ionicons name="checkmark-circle" size={22} color={C.success} style={{marginHorizontal:12}}/>
                  : <Ionicons name="chevron-forward" size={18} color={accentC} style={{marginHorizontal:12}}/>}
              </TouchableOpacity>
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
}

// ─── Écran Séance ─────────────────────────────────────
function WorkoutModal({ day, mode, onClose, onComplete }: any) {
  const [phase, setPhase] = useState<'preview'|'active'|'done'>('preview');
  const [exIdx, setExIdx] = useState(0);
  const [secs, setSecs] = useState(0);
  const [running, setRunning] = useState(false);
  const [startTime] = useState(Date.now());
  const pulse = useRef(new Animated.Value(1)).current;
  const celebAnim = useRef(new Animated.Value(0)).current;

  const ex = day.exercises[exIdx];
  const isLast = exIdx === day.exercises.length - 1;
  const hasDur = ex && ex.dur > 0;
  const accentG = mode==='grandir' ? G.grandir : G.glowup;

  useEffect(() => {
    if (ex && ex.dur) setSecs(ex.dur);
  }, [exIdx]);

  useEffect(() => {
    if (!running || !hasDur) return;
    if (secs <= 0) { setRunning(false); return; }
    const id = setInterval(()=>setSecs(s=>s-1), 1000);
    return ()=>clearInterval(id);
  }, [running, secs, hasDur]);

  useEffect(() => {
    if (running) {
      Animated.loop(Animated.sequence([
        Animated.timing(pulse,{toValue:1.06,duration:600,useNativeDriver:true}),
        Animated.timing(pulse,{toValue:1,duration:600,useNativeDriver:true}),
      ])).start();
    } else {
      pulse.stopAnimation(); pulse.setValue(1);
    }
  }, [running]);

  const nextEx = () => {
    if (isLast) {
      Animated.spring(celebAnim,{toValue:1,useNativeDriver:true,tension:30,friction:5}).start();
      setPhase('done');
    } else {
      setExIdx(i=>i+1);
      setRunning(false);
    }
  };

  const fmt = (s:number) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;
  const durationMins = Math.round((Date.now()-startTime)/60000);

  if (phase === 'preview') return (
    <LinearGradient colors={G.dark} style={{flex:1}}>
      <SafeAreaView style={{flex:1}}>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:20,paddingTop:16}}>
          <TouchableOpacity onPress={onClose} style={{width:38,height:38,borderRadius:19,backgroundColor:C.surface,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.border}}>
            <Ionicons name="close" size={22} color={C.text}/>
          </TouchableOpacity>
          <View style={{backgroundColor:C.primary+'30',paddingHorizontal:14,paddingVertical:6,borderRadius:20}}>
            <Text style={{color:C.primaryL,fontSize:13,fontWeight:'700'}}>Jour {day.day}</Text>
          </View>
        </View>
        <ScrollView contentContainerStyle={{padding:20,paddingTop:4,paddingBottom:40}}>
          <LinearGradient colors={accentG} style={{borderRadius:20,padding:24,alignItems:'center',marginBottom:20}}>
            <Text style={{color:'#fff',fontSize:28,fontWeight:'900',textAlign:'center',marginBottom:8}}>{day.title}</Text>
            <View style={{flexDirection:'row',gap:20,marginTop:8}}>
              {[['⏱',`${day.min}min`],['⚡',`+${day.xp}XP`],['🏋️',`${day.exercises.length} exos`]].map(([icon,val])=>(
                <View key={val} style={{alignItems:'center',gap:4}}>
                  <Text style={{fontSize:20}}>{icon}</Text>
                  <Text style={{color:'rgba(255,255,255,0.9)',fontWeight:'700',fontSize:13}}>{val}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>

          <Text style={{color:C.text,fontSize:17,fontWeight:'800',marginBottom:12}}>Programme de la séance</Text>
          {day.exercises.map((e:any, i:number)=>(
            <View key={i} style={{flexDirection:'row',alignItems:'center',gap:12,backgroundColor:C.surface,borderRadius:12,padding:14,marginBottom:8,borderWidth:1,borderColor:C.border}}>
              <View style={{width:30,height:30,borderRadius:15,backgroundColor:C.primary+'30',alignItems:'center',justifyContent:'center'}}>
                <Text style={{color:C.primaryL,fontWeight:'800',fontSize:13}}>{i+1}</Text>
              </View>
              <View style={{flex:1}}>
                <Text style={{color:C.text,fontSize:14,fontWeight:'700'}}>{e.name}</Text>
                <Text style={{color:C.muted,fontSize:12,marginTop:2}}>
                  {e.dur?`${e.dur}s`:`${e.reps} reps`}{e.sets>1?` × ${e.sets} séries`:''} · {e.diff==='easy'?'🟢':e.diff==='medium'?'🟡':'🔴'} {e.groups.join(', ')}
                </Text>
              </View>
              <Text style={{color:C.gold,fontSize:12,fontWeight:'700'}}>+{e.xp}XP</Text>
            </View>
          ))}

          <TouchableOpacity onPress={()=>setPhase('active')} activeOpacity={0.85} style={{borderRadius:14,overflow:'hidden',marginTop:16}}>
            <LinearGradient colors={accentG} start={{x:0,y:0}} end={{x:1,y:0}} style={{paddingVertical:16,alignItems:'center'}}>
              <Text style={{color:'#fff',fontSize:16,fontWeight:'800'}}>{day.rest?'✅ Marquer comme fait':'🚀 Démarrer la séance'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );

  if (phase === 'active' && ex) {
    const progress = hasDur ? 1 - secs/ex.dur : 0;
    const CIRCLE = W * 0.6;
    const diffColor = {easy:C.success,medium:C.warning,hard:C.error}[ex.diff as 'easy'|'medium'|'hard'];

    return (
      <LinearGradient colors={G.dark} style={{flex:1}}>
        <SafeAreaView style={{flex:1}}>
          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:20}}>
            <TouchableOpacity onPress={onClose} style={{width:38,height:38,borderRadius:19,backgroundColor:C.surface,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.border}}>
              <Ionicons name="close" size={20} color={C.muted}/>
            </TouchableOpacity>
            <View style={{flexDirection:'row',gap:4}}>
              {day.exercises.map((_:any,i:number)=>(
                <View key={i} style={{height:4,borderRadius:2,backgroundColor:i<exIdx?C.success:i===exIdx?C.primary:C.border,width:i===exIdx?20:8}}/>
              ))}
            </View>
            <View style={{backgroundColor:C.gold+'25',paddingHorizontal:12,paddingVertical:6,borderRadius:12}}>
              <Text style={{color:C.gold,fontSize:12,fontWeight:'800'}}>+{day.xp}XP</Text>
            </View>
          </View>

          <ScrollView contentContainerStyle={{paddingHorizontal:24,paddingBottom:40,alignItems:'center'}}>
            <Text style={{color:C.text,fontSize:22,fontWeight:'800',textAlign:'center',marginBottom:6}}>{ex.name}</Text>
            <View style={{flexDirection:'row',gap:8,marginBottom:20,alignItems:'center'}}>
              <View style={{backgroundColor:diffColor+'20',paddingHorizontal:10,paddingVertical:4,borderRadius:8}}>
                <Text style={{color:diffColor,fontSize:12,fontWeight:'700'}}>{ex.diff==='easy'?'Facile':ex.diff==='medium'?'Moyen':'Difficile'}</Text>
              </View>
              {ex.groups.map((g:string)=>(
                <View key={g} style={{backgroundColor:C.surfaceL,paddingHorizontal:8,paddingVertical:3,borderRadius:6}}>
                  <Text style={{color:C.muted,fontSize:11}}>{g}</Text>
                </View>
              ))}
            </View>

            {hasDur ? (
              <>
                <Animated.View style={{transform:[{scale:pulse}],marginVertical:24}}>
                  <LinearGradient colors={accentG} style={{width:CIRCLE,height:CIRCLE,borderRadius:CIRCLE/2,alignItems:'center',justifyContent:'center',shadowColor:mode==='grandir'?C.primary:C.accent,shadowOffset:{width:0,height:8},shadowOpacity:0.5,shadowRadius:20,elevation:12}}>
                    <Text style={{color:'rgba(255,255,255,0.7)',fontSize:13,fontWeight:'600',marginBottom:4}}>{running?'💪 Effort':'⏸ Pause'}</Text>
                    <Text style={{color:'#fff',fontSize:56,fontWeight:'900',letterSpacing:-2}}>{fmt(secs)}</Text>
                    <Text style={{color:'rgba(255,255,255,0.6)',fontSize:13,marginTop:2}}>{ex.sets>1?`${ex.sets} séries`:'1 série'}</Text>
                  </LinearGradient>
                </Animated.View>
                <TouchableOpacity onPress={()=>setRunning(r=>!r)} activeOpacity={0.85} style={{borderRadius:40,overflow:'hidden',marginBottom:24}}>
                  <LinearGradient colors={accentG} style={{width:72,height:72,alignItems:'center',justifyContent:'center'}}>
                    <Ionicons name={running?'pause':'play'} size={32} color="#fff"/>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            ) : (
              <View style={{alignItems:'center',marginVertical:32}}>
                <LinearGradient colors={accentG} style={{width:160,height:160,borderRadius:80,alignItems:'center',justifyContent:'center',shadowColor:C.primary,shadowOffset:{width:0,height:8},shadowOpacity:0.4,shadowRadius:16,elevation:10,marginBottom:16}}>
                  <Text style={{color:'#fff',fontSize:60,fontWeight:'900'}}>{ex.reps}</Text>
                  <Text style={{color:'rgba(255,255,255,0.8)',fontSize:16,fontWeight:'600'}}>répétitions</Text>
                </LinearGradient>
                {ex.sets>1 && <Text style={{color:C.muted,fontSize:13}}>× {ex.sets} séries · Repos {ex.rest||30}s</Text>}
              </View>
            )}

            <View style={{backgroundColor:C.gold+'20',paddingHorizontal:16,paddingVertical:6,borderRadius:20,marginBottom:20}}>
              <Text style={{color:C.gold,fontWeight:'800',fontSize:14}}>+{ex.xp} XP</Text>
            </View>

            <TouchableOpacity onPress={nextEx} activeOpacity={0.85} style={{borderRadius:14,overflow:'hidden',width:'100%'}}>
              <LinearGradient colors={isLast?G.success:accentG} start={{x:0,y:0}} end={{x:1,y:0}} style={{paddingVertical:16,alignItems:'center'}}>
                <Text style={{color:'#fff',fontSize:16,fontWeight:'800'}}>{isLast?'🏆 Terminer la séance':'Exercice suivant →'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Done
  const sc = celebAnim.interpolate({inputRange:[0,1],outputRange:[0.5,1]});
  return (
    <LinearGradient colors={G.dark} style={{flex:1}}>
      <SafeAreaView style={{flex:1}}>
        <Animated.View style={{flex:1,alignItems:'center',justifyContent:'center',padding:32,gap:18,opacity:celebAnim,transform:[{scale:sc}]}}>
          <LinearGradient colors={G.success} style={{width:110,height:110,borderRadius:55,alignItems:'center',justifyContent:'center',shadowColor:C.success,shadowOffset:{width:0,height:8},shadowOpacity:0.5,shadowRadius:20,elevation:12}}>
            <Text style={{fontSize:54}}>🏆</Text>
          </LinearGradient>
          <Text style={{color:C.text,fontSize:34,fontWeight:'900',textAlign:'center'}}>Séance terminée !</Text>
          <Text style={{color:C.muted,fontSize:16,textAlign:'center'}}>{day.title}</Text>
          <View style={{flexDirection:'row',gap:24,backgroundColor:C.surface,borderRadius:20,padding:20,borderWidth:1,borderColor:C.border}}>
            {[['+ '+day.xp,'XP gagnés'],[(day.exercises.length).toString(),'Exercices'],[durationMins||1+'','Minutes']].map(([v,l])=>(
              <View key={l} style={{alignItems:'center',gap:4}}>
                <Text style={{color:C.text,fontSize:24,fontWeight:'900'}}>{v}</Text>
                <Text style={{color:C.muted,fontSize:12}}>{l}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity onPress={onComplete} activeOpacity={0.85} style={{borderRadius:14,overflow:'hidden',width:'100%'}}>
            <LinearGradient colors={G.primary} start={{x:0,y:0}} end={{x:1,y:0}} style={{paddingVertical:16,alignItems:'center'}}>
              <Text style={{color:'#fff',fontSize:16,fontWeight:'800'}}>Retour au programme</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ─── Écran Progrès ────────────────────────────────────
function ProgressScreen() {
  const heights = [169.5, 170.0, 170.2, 171.0, 171.8, 172.0, 172.0];
  const dates   = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul'];
  const target  = USER.target;
  const gain    = +(heights[heights.length-1] - heights[0]).toFixed(1);
  const toGoal  = +(target - heights[heights.length-1]).toFixed(1);
  const pct     = Math.min(1, gain / (target - heights[0]));
  const [tab, setTab] = useState<'mesures'|'photos'>('mesures');

  const chartH = 120;
  const minH = Math.min(...heights) - 0.5;
  const maxH = Math.max(...heights) + 0.5;
  const points = heights.map((h,i) => ({
    x: (i / (heights.length-1)) * (W-80),
    y: chartH - ((h-minH)/(maxH-minH)) * chartH,
  }));

  return (
    <ScrollView style={{flex:1,backgroundColor:C.bg}} contentContainerStyle={{padding:20,paddingTop:60,paddingBottom:100}}>
      <Text style={{color:C.text,fontSize:28,fontWeight:'900',marginBottom:20}}>Mes Progrès 📈</Text>

      {/* Stats row */}
      <View style={{flexDirection:'row',gap:10,marginBottom:16}}>
        {[[G.grandir,heights[heights.length-1]+' cm','Taille actuelle'],[G.glowup,(gain>0?'+':'')+gain+' cm','Progression'],[G.gold,'42%','Percentile']].map(([g,v,l]:any)=>(
          <LinearGradient key={l} colors={g} style={{flex:1,borderRadius:16,padding:14,alignItems:'center'}}>
            <Text style={{color:'#fff',fontSize:18,fontWeight:'900'}}>{v}</Text>
            <Text style={{color:'rgba(255,255,255,0.75)',fontSize:10,marginTop:2,textAlign:'center'}}>{l}</Text>
          </LinearGradient>
        ))}
      </View>

      {/* Goal card */}
      <Card style={{marginBottom:20}}>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <View>
            <Text style={{color:C.muted,fontSize:12,marginBottom:4}}>Objectif de taille</Text>
            <Text style={{color:C.text,fontSize:24,fontWeight:'800'}}>{target} cm</Text>
          </View>
          <View style={{backgroundColor:C.primary+'30',paddingHorizontal:14,paddingVertical:8,borderRadius:20,alignItems:'center'}}>
            <Text style={{color:C.primaryL,fontSize:11}}>encore</Text>
            <Text style={{color:C.primaryL,fontSize:16,fontWeight:'800'}}>{toGoal} cm</Text>
          </View>
        </View>
        <View style={{height:8,backgroundColor:C.border,borderRadius:4,overflow:'hidden',marginBottom:8}}>
          <LinearGradient colors={G.primary} start={{x:0,y:0}} end={{x:1,y:0}} style={{height:'100%',width:`${Math.max(4,pct*100)}%`,borderRadius:4}}/>
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
          <Text style={{color:C.dim,fontSize:12}}>{heights[0]} cm</Text>
          <Text style={{color:C.dim,fontSize:12}}>{target} cm 🎯</Text>
        </View>
      </Card>

      {/* Chart */}
      <Card style={{marginBottom:20}}>
        <Text style={{color:C.text,fontSize:15,fontWeight:'700',marginBottom:16}}>📏 Évolution de taille</Text>
        <View style={{height:chartH+30,position:'relative'}}>
          {/* Grid lines */}
          {[0,0.5,1].map(p=>(
            <View key={p} style={{position:'absolute',top:chartH*p,left:0,right:0,height:1,backgroundColor:C.border+'60'}}/>
          ))}
          {/* Area fill */}
          {points.slice(1).map((pt,i)=>{
            const prev = points[i];
            const dxLine = pt.x - prev.x;
            const dyLine = pt.y - prev.y;
            const len = Math.sqrt(dxLine*dxLine+dyLine*dyLine);
            const angle = Math.atan2(dyLine,dxLine)*180/Math.PI;
            return (
              <View key={i} style={{position:'absolute',left:prev.x+20,top:prev.y,width:len,height:2,backgroundColor:C.primaryL,transformOrigin:'left center',transform:[{rotate:`${angle}deg`}]}}/>
            );
          })}
          {/* Points */}
          {points.map((pt,i)=>(
            <View key={i} style={{position:'absolute',left:pt.x+14,top:pt.y-5,width:12,height:12,borderRadius:6,backgroundColor:C.primary,borderWidth:2,borderColor:C.primaryL}}>
              <View/>
            </View>
          ))}
          {/* Labels */}
          {dates.map((d,i)=>(
            <Text key={d} style={{position:'absolute',left:points[i].x+14,top:chartH+8,color:C.dim,fontSize:10,width:24,textAlign:'center'}}>{d}</Text>
          ))}
        </View>
      </Card>

      {/* Tabs */}
      <View style={{flexDirection:'row',backgroundColor:C.surface,borderRadius:12,padding:4,marginBottom:16,borderWidth:1,borderColor:C.border}}>
        {[['mesures','📊 Mesures'],['photos','📸 Photos']].map(([t,l])=>(
          <TouchableOpacity key={t} onPress={()=>setTab(t as any)} style={{flex:1,paddingVertical:10,borderRadius:9,alignItems:'center',backgroundColor:tab===t?C.surfaceL:'transparent'}}>
            <Text style={{color:tab===t?C.primaryL:C.dim,fontSize:13,fontWeight:tab===t?'700':'600'}}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'mesures' ? (
        <>
          <Text style={{color:C.text,fontSize:15,fontWeight:'700',marginBottom:10}}>📏 Historique de taille</Text>
          <Card>
            {heights.map((h,i)=>(
              <View key={i} style={{flexDirection:'row',alignItems:'center',padding:14,borderBottomWidth:i<heights.length-1?1:0,borderBottomColor:C.border+'60',gap:12}}>
                <View style={{width:10,height:10,borderRadius:5,backgroundColor:C.primary}}/>
                <View style={{flex:1}}>
                  <Text style={{color:C.text,fontSize:16,fontWeight:'700'}}>{h} cm</Text>
                  {i===heights.length-1 && <Text style={{color:C.success,fontSize:11,marginTop:1}}>Dernière mesure</Text>}
                </View>
                <Text style={{color:C.dim,fontSize:12}}>{dates[i]} 2025</Text>
                {i>0 && h>heights[i-1] && <Text style={{color:C.success,fontSize:11,fontWeight:'700'}}>+{(h-heights[i-1]).toFixed(1)}</Text>}
              </View>
            ))}
          </Card>
        </>
      ) : (
        <View style={{alignItems:'center',padding:40,backgroundColor:C.surface,borderRadius:16,borderWidth:1,borderColor:C.border,gap:12}}>
          <Text style={{fontSize:56}}>📸</Text>
          <Text style={{color:C.text,fontSize:16,fontWeight:'700'}}>Photos avant/après</Text>
          <Text style={{color:C.muted,fontSize:13,textAlign:'center'}}>Prends des photos régulièrement pour voir ta transformation</Text>
          <TouchableOpacity style={{borderRadius:12,overflow:'hidden',marginTop:8}}>
            <LinearGradient colors={G.primary} style={{paddingVertical:12,paddingHorizontal:24}}>
              <Text style={{color:'#fff',fontWeight:'700'}}>📷 Ajouter une photo</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

// ─── Écran Défis ─────────────────────────────────────
function ChallengesScreen() {
  const [challenges, setChallenges] = useState(CHALLENGES);
  const done = challenges.filter(c=>c.done);
  const xpTotal = challenges.reduce((s,c)=>s+c.xp,0);
  const xpEarned = done.reduce((s,c)=>s+c.xp,0);

  const toggle = (id: string) => {
    setChallenges(cs=>cs.map(c=>c.id===id?{...c,done:!c.done}:c));
  };

  const achUnlocked = ACHIEVEMENTS.filter(a=>a.done);
  const achLocked   = ACHIEVEMENTS.filter(a=>!a.done);

  return (
    <ScrollView style={{flex:1,backgroundColor:C.bg}} contentContainerStyle={{padding:20,paddingTop:60,paddingBottom:100}}>
      <Text style={{color:C.text,fontSize:28,fontWeight:'900',marginBottom:20}}>Défis & Succès 🏆</Text>

      {/* Daily header */}
      <Card style={{marginBottom:14}}>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <View>
            <Text style={{color:C.text,fontSize:15,fontWeight:'700'}}>Défis du jour</Text>
            <Text style={{color:C.muted,fontSize:12,textTransform:'capitalize',marginTop:2}}>
              {new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})}
            </Text>
          </View>
          <LinearGradient colors={G.gold} style={{paddingHorizontal:14,paddingVertical:8,borderRadius:20}}>
            <Text style={{color:'#fff',fontWeight:'800',fontSize:13}}>{xpEarned} / {xpTotal} XP</Text>
          </LinearGradient>
        </View>
        <View style={{height:6,backgroundColor:C.border,borderRadius:3,overflow:'hidden'}}>
          <LinearGradient colors={G.gold} start={{x:0,y:0}} end={{x:1,y:0}} style={{height:'100%',width:`${xpTotal>0?(xpEarned/xpTotal)*100:0}%`,borderRadius:3}}/>
        </View>
        <Text style={{color:C.dim,fontSize:11,marginTop:8}}>{done.length}/{challenges.length} défis complétés</Text>
      </Card>

      {challenges.map(c=>(
        <TouchableOpacity key={c.id} onPress={()=>toggle(c.id)} activeOpacity={0.8}
          style={{flexDirection:'row',alignItems:'center',gap:14,backgroundColor:c.done?C.success+'15':C.surface,borderRadius:14,padding:16,marginBottom:10,borderWidth:1,borderColor:c.done?C.success+'50':C.border}}>
          <Text style={{fontSize:32}}>{c.icon}</Text>
          <View style={{flex:1}}>
            <Text style={{color:C.text,fontSize:15,fontWeight:'700',marginBottom:2}}>{c.title}</Text>
            <Text style={{color:C.muted,fontSize:12}}>{c.desc}</Text>
          </View>
          <View style={{alignItems:'center',gap:4}}>
            <LinearGradient colors={c.done?G.success:G.gold} style={{paddingHorizontal:10,paddingVertical:4,borderRadius:10}}>
              <Text style={{color:'#fff',fontSize:12,fontWeight:'800'}}>+{c.xp}</Text>
            </LinearGradient>
            {c.done && <Ionicons name="checkmark-circle" size={20} color={C.success}/>}
          </View>
        </TouchableOpacity>
      ))}

      <Text style={{color:C.text,fontSize:20,fontWeight:'800',marginTop:20,marginBottom:14}}>Succès 🏅</Text>

      <Text style={{color:C.primaryL,fontSize:14,fontWeight:'700',marginBottom:10}}>✅ Obtenus ({achUnlocked.length})</Text>
      <View style={{flexDirection:'row',flexWrap:'wrap',gap:10,marginBottom:20}}>
        {achUnlocked.map(a=>(
          <LinearGradient key={a.title} colors={G.gold} style={{width:(W-60)/2,borderRadius:16,padding:16,alignItems:'center',gap:6}}>
            <View style={{width:52,height:52,borderRadius:26,backgroundColor:'rgba(255,255,255,0.2)',alignItems:'center',justifyContent:'center'}}>
              <Text style={{fontSize:26}}>{a.icon}</Text>
            </View>
            <Text style={{color:'#fff',fontSize:13,fontWeight:'700',textAlign:'center'}}>{a.title}</Text>
            <Text style={{color:'rgba(255,255,255,0.8)',fontSize:11,textAlign:'center'}}>{a.desc}</Text>
            <Text style={{color:'#fff',fontSize:12,fontWeight:'800'}}>+{a.xp} XP</Text>
          </LinearGradient>
        ))}
      </View>

      <Text style={{color:C.muted,fontSize:14,fontWeight:'700',marginBottom:10}}>🔒 À débloquer ({achLocked.length})</Text>
      <View style={{flexDirection:'row',flexWrap:'wrap',gap:10}}>
        {achLocked.map(a=>(
          <View key={a.title} style={{width:(W-60)/2,backgroundColor:C.surface,borderRadius:16,padding:16,alignItems:'center',gap:6,borderWidth:1,borderColor:C.border,opacity:0.6}}>
            <View style={{width:52,height:52,borderRadius:26,backgroundColor:C.surfaceL,alignItems:'center',justifyContent:'center'}}>
              <Text style={{fontSize:26,opacity:0.3}}>{a.icon}</Text>
            </View>
            <Text style={{color:C.dim,fontSize:13,fontWeight:'700',textAlign:'center'}}>{a.title}</Text>
            <Text style={{color:C.dim,fontSize:11,textAlign:'center'}}>{a.desc}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// ─── Écran Profil ─────────────────────────────────────
function ProfileScreen({ onLogout }: { onLogout: () => void }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(USER.name);

  return (
    <ScrollView style={{flex:1,backgroundColor:C.bg}} contentContainerStyle={{paddingBottom:100}}>
      {/* Hero */}
      <LinearGradient colors={[C.primary+'40',C.bg]} style={{paddingTop:70,paddingBottom:28,alignItems:'center',gap:10,paddingHorizontal:20}}>
        <LinearGradient colors={G.primary} style={{width:96,height:96,borderRadius:48,alignItems:'center',justifyContent:'center',marginBottom:6}}>
          <Text style={{fontSize:46}}>💪</Text>
        </LinearGradient>
        {editing ? (
          <TextInput value={name} onChangeText={setName} onBlur={()=>setEditing(false)} style={{color:C.text,fontSize:22,fontWeight:'800',borderBottomWidth:1,borderBottomColor:C.primary,textAlign:'center',paddingBottom:2}} autoFocus/>
        ) : (
          <TouchableOpacity onPress={()=>setEditing(true)}>
            <Text style={{color:C.text,fontSize:22,fontWeight:'800'}}>{name} ✏️</Text>
          </TouchableOpacity>
        )}
        <Text style={{color:C.muted,fontSize:14}}>{USER.email}</Text>
        <View style={{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:C.primaryL+'20',paddingHorizontal:16,paddingVertical:8,borderRadius:20,marginTop:4}}>
          <Text style={{fontSize:16}}>⚡</Text>
          <Text style={{color:C.primaryL,fontSize:14,fontWeight:'700'}}>{USER.rank}</Text>
        </View>
      </LinearGradient>

      <View style={{padding:20,gap:16}}>
        {/* XP Card */}
        <Card>
          <XPBar xp={USER.xp} level={USER.level}/>
          <View style={{flexDirection:'row',alignItems:'center',marginTop:16}}>
            {[[USER.xp.toString(),'XP total'],['Niv. '+USER.level,'Niveau actuel'],[(500-USER.xp%500).toString(),'XP → Niv. '+(USER.level+1)]].map(([v,l],i)=>(
              <React.Fragment key={l}>
                {i>0 && <View style={{width:1,height:32,backgroundColor:C.border}}/>}
                <View style={{flex:1,alignItems:'center',gap:2}}>
                  <Text style={{color:C.text,fontSize:15,fontWeight:'800'}}>{v}</Text>
                  <Text style={{color:C.dim,fontSize:10,textAlign:'center'}}>{l}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>
        </Card>

        {/* Streak */}
        <Card>
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
            <View>
              <Text style={{color:C.muted,fontSize:13,marginBottom:4}}>Streak actuel 🔥</Text>
              <Text style={{color:C.text,fontSize:20,fontWeight:'800'}}>{USER.streak} jours consécutifs</Text>
              <Text style={{color:C.dim,fontSize:12,marginTop:4}}>Continue comme ça !</Text>
            </View>
            <StreakBadge n={USER.streak}/>
          </View>
        </Card>

        {/* Stats grid */}
        <Text style={{color:C.text,fontSize:16,fontWeight:'700'}}>Mes informations</Text>
        <View style={{flexDirection:'row',flexWrap:'wrap',gap:10}}>
          {[
            ['resize-outline','Taille',`${USER.height} cm`],
            ['barbell-outline','Poids',`${USER.weight} kg`],
            ['trending-up-outline','Objectif',`${USER.target} cm`],
            ['star-outline','Programme','💪 Grandir'],
          ].map(([icon,label,val])=>(
            <View key={label} style={{width:(W-60)/2,backgroundColor:C.surface,borderRadius:14,padding:16,gap:6,borderWidth:1,borderColor:C.border}}>
              <Ionicons name={icon as any} size={20} color={C.primaryL}/>
              <Text style={{color:C.muted,fontSize:12}}>{label}</Text>
              <Text style={{color:C.text,fontSize:16,fontWeight:'700'}}>{val}</Text>
            </View>
          ))}
        </View>

        {/* Settings */}
        <Text style={{color:C.text,fontSize:16,fontWeight:'700',marginTop:4}}>Paramètres</Text>
        {[
          ['trophy-outline','Mes succès',G.gold],
          ['notifications-outline','Notifications',G.primary],
          ['share-outline','Partager l\'app',G.glowup],
          ['shield-outline','Confidentialité',G.grandir],
        ].map(([icon,label,grad])=>(
          <TouchableOpacity key={label} style={{flexDirection:'row',alignItems:'center',gap:14,backgroundColor:C.surface,borderRadius:14,padding:16,borderWidth:1,borderColor:C.border}}>
            <LinearGradient colors={grad as any} style={{width:38,height:38,borderRadius:10,alignItems:'center',justifyContent:'center'}}>
              <Ionicons name={icon as any} size={18} color="#fff"/>
            </LinearGradient>
            <Text style={{flex:1,color:C.text,fontSize:15,fontWeight:'600'}}>{label}</Text>
            <Ionicons name="chevron-forward" size={16} color={C.dim}/>
          </TouchableOpacity>
        ))}

        <TouchableOpacity onPress={onLogout} activeOpacity={0.85} style={{borderRadius:14,overflow:'hidden',marginTop:8}}>
          <LinearGradient colors={['#7f1d1d','#EF4444'] as const} start={{x:0,y:0}} end={{x:1,y:0}} style={{paddingVertical:14,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:10}}>
            <Ionicons name="log-out-outline" size={20} color="#fff"/>
            <Text style={{color:'#fff',fontSize:15,fontWeight:'800'}}>Se déconnecter</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─── App principale ───────────────────────────────────
type Tab = 'programme'|'progres'|'defis'|'profil';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState<Tab>('programme');
  const [workout, setWorkout] = useState<{day:any;mode:string}|null>(null);

  const TABS: {key:Tab;label:string;icon:string;activeIcon:string}[] = [
    {key:'programme',label:'Programme',icon:'barbell-outline',activeIcon:'barbell'},
    {key:'progres',label:'Progrès',icon:'trending-up-outline',activeIcon:'trending-up'},
    {key:'defis',label:'Défis',icon:'trophy-outline',activeIcon:'trophy'},
    {key:'profil',label:'Profil',icon:'person-outline',activeIcon:'person'},
  ];

  if (!loggedIn) return <LoginScreen onLogin={()=>setLoggedIn(true)}/>;

  return (
    <View style={{flex:1,backgroundColor:C.bg}}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg}/>
      {/* Screens */}
      {tab==='programme' && <ProgramScreen onStartDay={(day,mode)=>setWorkout({day,mode})}/>}
      {tab==='progres'   && <ProgressScreen/>}
      {tab==='defis'     && <ChallengesScreen/>}
      {tab==='profil'    && <ProfileScreen onLogout={()=>setLoggedIn(false)}/>}

      {/* Bottom Tab Bar */}
      <View style={s.tabBar}>
        {TABS.map(t=>{
          const active = tab===t.key;
          return (
            <TouchableOpacity key={t.key} onPress={()=>setTab(t.key)} style={s.tabItem} activeOpacity={0.7}>
              {active && (
                <LinearGradient colors={G.primary} style={{position:'absolute',top:0,left:'20%',right:'20%',height:2,borderRadius:1}}/>
              )}
              <View style={{width:36,height:36,borderRadius:10,alignItems:'center',justifyContent:'center',backgroundColor:active?C.primary+'25':'transparent'}}>
                <Ionicons name={(active?t.activeIcon:t.icon) as any} size={active?24:22} color={active?C.primaryL:C.dim}/>
              </View>
              <Text style={{color:active?C.primaryL:C.dim,fontSize:10,fontWeight:active?'700':'600',marginTop:2}}>{t.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Workout Modal */}
      <Modal visible={!!workout} animationType="slide" presentationStyle="fullScreen">
        {workout && (
          <WorkoutModal
            day={workout.day}
            mode={workout.mode}
            onClose={()=>setWorkout(null)}
            onComplete={()=>setWorkout(null)}
          />
        )}
      </Modal>
    </View>
  );
}

// ─── Styles globaux ───────────────────────────────────
const s = StyleSheet.create({
  card: {
    backgroundColor: C.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 14,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: C.surface+'EE',
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingBottom: Platform.OS==='ios'?20:8,
    paddingTop: 8,
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    position: 'relative',
    paddingTop: 6,
  },
});
