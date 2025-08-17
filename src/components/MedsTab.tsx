'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Pill, 
  Plus, 
  Trash2,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// 약물 데이터 인터페이스
interface MedicationItem {
  id: string;
  name: string;
  time: string;
  dosage: string;
  taken: boolean;
  type: string;
}

// 새 약물 폼 데이터 인터페이스
interface NewMedicationForm {
  name: string;
  time: string;
  dosage: string;
}

interface MedsTabProps {
  onToast?: (message: string, type?: 'success' | 'info') => void;
}

export default function MedsTab({ onToast }: MedsTabProps) {
  const [showAddMedicationModal, setShowAddMedicationModal] = useState(false);
  const [newMedication, setNewMedication] = useState<NewMedicationForm>({
    name: '',
    time: '',
    dosage: ''
  });
  
  // 약물 데이터 상태 관리
  const [medicationData, setMedicationData] = useState<MedicationItem[]>([
    { id: '1', name: '혈압약', time: '08:00', dosage: '1정', taken: true, type: '아침' },
    { id: '2', name: '당뇨약', time: '12:00', dosage: '1정', taken: true, type: '점심' },
    { id: '3', name: '비타민D', time: '19:00', dosage: '1정', taken: false, type: '저녁' },
    { id: '4', name: '오메가3', time: '21:00', dosage: '1정', taken: false, type: '자기전' },
  ]);

  // 토스트 메시지 표시 함수
  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    if (onToast) {
      onToast(message, type);
    }
  };

  // 약물 복용 상태 전환 기능
  const toggleMedicationStatus = (medicationId: string) => {
    const medication = medicationData.find(med => med.id === medicationId);
    if (!medication) return;
    
    setMedicationData(prev => 
      prev.map(med => 
        med.id === medicationId 
          ? { ...med, taken: !med.taken }
          : med
      )
    );
    
    // 토스트 메시지 표시
    if (medication.taken) {
      showToast(`${medication.name} 복용을 취소했습니다.`, 'info');
    } else {
      showToast(`${medication.name} 복용 완료했습니다!`, 'success');
    }
  };
  
  // 투약 현황 계산
  const medicationStats = {
    taken: medicationData.filter(med => med.taken).length,
    total: medicationData.length,
    percentage: Math.round((medicationData.filter(med => med.taken).length / medicationData.length) * 100)
  };
  
  // 약물 삭제 기능
  const handleDeleteMedication = (medicationId: string, medicationName: string) => {
    if (window.confirm(`"${medicationName}" 약물을 삭제하시겠습니까?`)) {
      setMedicationData(prev => prev.filter(med => med.id !== medicationId));
      showToast(`${medicationName}이(가) 삭제되었습니다.`, 'info');
    }
  };

  // 시간대에 따른 카테고리 자동 분류
  const getMedicationCategory = (time: string): string => {
    const hour = parseInt(time.split(':')[0]);
    
    if (hour >= 6 && hour < 12) {
      return '아침';
    } else if (hour >= 12 && hour < 18) {
      return '점심';
    } else if (hour >= 18 && hour < 22) {
      return '저녁';
    } else {
      return '자기전';
    }
  };

  // 약물 추가 모달 열기
  const handleOpenAddMedicationModal = () => {
    setShowAddMedicationModal(true);
    setNewMedication({
      name: '',
      time: '',
      dosage: ''
    });
  };

  // 약물 추가 모달 닫기
  const handleCloseAddMedicationModal = () => {
    setShowAddMedicationModal(false);
  };

  // 새 약물 저장
  const handleSaveMedication = () => {
    // 유효성 검사
    if (!newMedication.name.trim()) {
      alert('약물명을 입력해주세요.');
      return;
    }
    if (!newMedication.time.trim()) {
      alert('복용 시간을 입력해주세요.');
      return;
    }
    if (!newMedication.dosage.trim()) {
      alert('복용량을 입력해주세요.');
      return;
    }

    // 새 약물 생성
    const medicationToAdd: MedicationItem = {
      id: `medication_${Date.now()}`,
      name: newMedication.name,
      time: newMedication.time,
      dosage: newMedication.dosage,
      taken: false,
      type: getMedicationCategory(newMedication.time)
    };

    // 약물 데이터에 추가
    setMedicationData(prev => [...prev, medicationToAdd]);
    
    // 성공 메시지
    showToast(`${newMedication.name}이(가) 추가되었습니다.`, 'success');
    
    // 모달 닫기
    handleCloseAddMedicationModal();
  };

  return (
    <>
      {/* Medication Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className={`text-white transition-all duration-500 ${
          medicationStats.percentage >= 75 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
            : medicationStats.percentage >= 50 
            ? 'bg-gradient-to-r from-orange-500 to-yellow-500' 
            : 'bg-gradient-to-r from-red-500 to-pink-500'
        }`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">투약 현황</h3>
              <Pill className="w-5 h-5" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{medicationStats.taken}/{medicationStats.total}</div>
                <div className="text-white text-opacity-80 text-sm">복용 완료</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{medicationStats.percentage}%</div>
                <div className="text-white text-opacity-80 text-sm">달성률</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Medication List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">투약 스케줄</h3>
          <Button 
            size="sm" 
            className="bg-orange-500 hover:bg-orange-600"
            onClick={handleOpenAddMedicationModal}
          >
            <Plus className="w-4 h-4 mr-2" />
            추가
          </Button>
        </div>
        <div className="space-y-3">
          {medicationData
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((med, index) => (
            <motion.div
              key={med.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`hover:shadow-md transition-all duration-300 ${
                  med.taken ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div 
                      className="flex items-center gap-3 flex-1 cursor-pointer"
                      onClick={() => toggleMedicationStatus(med.id)}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        med.taken ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <Pill className={`w-5 h-5 ${
                          med.taken ? 'text-green-600' : 'text-red-600'
                        }`} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{med.name}</div>
                        <div className="text-sm text-gray-600">{med.time} • {med.dosage}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          med.taken ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {med.taken ? '복용 완료' : '복용 대기'}
                        </div>
                        <div className="text-xs text-gray-500">{med.type}</div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMedication(med.id, med.name);
                        }}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
                        title="약물 삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 약물 추가 모달 */}
      {showAddMedicationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-md w-full"
          >
            <div className="p-6">
              {/* 모달 헤더 */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">약물 추가</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseAddMedicationModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* 약물 정보 입력 */}
              <div className="space-y-4">
                {/* 약물명 */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    약물명
                  </Label>
                  <Input
                    type="text"
                    value={newMedication.name}
                    onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="예: 혈압약"
                    className="w-full"
                  />
                </div>

                {/* 복용 시간 */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    복용 시간
                  </Label>
                  <Input
                    type="time"
                    value={newMedication.time}
                    onChange={(e) => setNewMedication(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    시간대별 자동 분류: 06-12시(아침), 12-18시(점심), 18-22시(저녁), 그 외(자기전)
                  </p>
                </div>

                {/* 복용량 */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    복용량
                  </Label>
                  <Input
                    type="text"
                    value={newMedication.dosage}
                    onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                    placeholder="예: 1정"
                    className="w-full"
                  />
                </div>
              </div>

              {/* 모달 푸터 */}
              <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                <Button
                  variant="outline"
                  onClick={handleCloseAddMedicationModal}
                  className="px-6"
                >
                  취소
                </Button>
                <Button
                  onClick={handleSaveMedication}
                  className="bg-orange-500 hover:bg-orange-600 px-6"
                >
                  저장
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
